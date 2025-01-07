import prisma from "../db/connectDB.js";

export const createOrder = async (req, res) => {
  try {
    const { productId } = req.params;

    var { quantity } = req.body || 1;
    if (!quantity) {
      quantity = 1;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { visaCards: true },
    });

    if (!user.visaCards.length) {
      return res.status(400).json({
        success: false,
        message: "No connected card found. Please connect a card.",
      });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    if (user.balance < product.price * quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance. Connect your crypto wallet.",
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient quantity.",
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: req.userId,
        productId,
        totalPrice: product.price * quantity,
        quantity,
      },
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        quantity: product.quantity - quantity,
      },
    });

    await prisma.user.update({
      where: { id: req.userId },
      data: {
        balance: user.balance - product.price * quantity,
      },
    });

    return res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const connectVisaCard = async (req, res) => {
  try {
    const { cardNumber, expiryDate, cvv } = req.body;

    if (!cardNumber || !expiryDate || !cvv) {
      return res.status(400).json({
        success: false,
        message: "Card number, expiry date, and CVV are required.",
      });
    }

    const existingCard = await prisma.visaCard.findFirst({
      where: { cardNumber },
    });

    if (existingCard) {
      return res.status(400).json({
        success: false,
        message: "This card is already connected to another account.",
      });
    }

    const card = await prisma.visaCard.create({
      data: {
        cardNumber,
        expiryDate,
        cvv,
        userId: req.userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Visa card connected successfully.",
      card,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const connectCryptoWallet = async (req, res) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        message: "Wallet address is required.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    await prisma.user.update({
      where: { id: req.userId },
      data: {
        balance: user.balance + 10000,
      },
    });

    res.status(200).json({
      success: true,
      message: `Crypto wallet connected successfully. and your updated balance is ${
        user.balance + 10000
      }`,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!order || order.userId !== req.userId) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be canceled.",
      });
    }

    order.user.balance += order.totalPrice;

    await prisma.order.update({
      where: { id },
      data: { status: "canceled" },
    });

    res
      .status(200)
      .json({ success: true, message: "Order canceled successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const finishOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order || order.userId !== req.userId) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found." });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending orders can be finished.",
      });
    }

    // Update order status and release frozen amount
    await prisma.$transaction([
      prisma.order.update({
        where: { id },
        data: { status: "finished" },
      }),
    ]);
    const product = await prisma.product.findUnique({
      where: { id: order.productId },
    });

    await prisma.user.update({
      where: { id: product.userId },
      data: { balance: { increment: order.totalPrice } },
    });

    res
      .status(200)
      .json({ success: true, message: "Order completed successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: { product: true },
    });

    if (!orders.length) {
      return res
        .status(404)
        .json({ success: false, message: "No orders found." });
    }

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

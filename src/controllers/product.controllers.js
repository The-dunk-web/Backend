import prisma from "../db/connectDB.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, offerPrice } = req.body;

    if (!name || !description || !price || !quantity) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const photos = req.files.map((file) => file.path);

    const product = await prisma.product.create({
      data: {
        name,
        description,
        photos,
        price: parseFloat(price),
        offerPrice: offerPrice ? parseFloat(offerPrice) : null,
        quantity: parseInt(quantity),
        userId: req.userId,
      },
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, quantity, offerPrice } = req.body;

    var photos = req.files?.map((file) => file.path);

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (photos.length === 0) {
      photos = product.photos;
    }

    if (product.userId !== req.userId) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to update this product",
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: name || product.name,
        description: description || product.description,
        photos: photos,
        price: price ? parseFloat(price) : product.price,
        offerPrice: offerPrice ? parseFloat(offerPrice) : product.offerPrice,
        quantity: quantity ? parseInt(quantity) : product.quantity,
      },
    });

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.userId !== req.userId) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to delete this product",
      });
    }

    await prisma.product.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const orderProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.quantity < quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough stock available" });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        quantity: product.quantity - quantity,
      },
    });

    res.status(200).json({
      success: true,
      message: "Product ordered successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

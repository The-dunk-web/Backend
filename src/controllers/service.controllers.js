import prisma from "../db/connectDB.js";

export const createService = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields." });
    }

    var images = [];
    if (req.files) {
      images = req.files.map((file) => file.path);
    }

    const newService = await prisma.service.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        images,
        userId: req.userId,
      },
    });

    res.status(201).json({ success: true, service: newService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
        reviews: {
          select: { rating: true, comment: true },
        },
      },
    });

    if (services.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No services found." });
    }

    res.status(200).json({ success: true, services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
        reviews: {
          select: { rating: true, comment: true },
        },
      },
    });

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    }

    res.status(200).json({ success: true, service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    }

    var images = [];
    if (req.files) {
      images = req.files.map((file) => file.path);
    }

    if (images.length === 0) {
      images = service.images;
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        name: name || service.name,
        description: description || service.description,
        price: price ? parseFloat(price) : service.price,
        images,
      },
    });

    res.status(200).json({ success: true, service: updatedService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    }

    if (service.userId !== req.userId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "You are not authorized to delete this service.",
        });
    }

    await prisma.service.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ success: true, message: "Service deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

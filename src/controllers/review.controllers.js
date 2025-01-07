import prisma from "../db/connectDB.js";
export const addReview = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5." });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    }

    const existingReview = await prisma.review.findFirst({
      where: { serviceId, userId: req.userId },
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this service.",
      });
    }

    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating, 10),
        comment: comment || null,
        serviceId,
        userId: req.userId,
      },
    });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the review.",
      error: error.message,
    });
  }
};

export const getReviewsForService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found." });
    }

    const reviews = await prisma.review.findMany({
      where: { serviceId },
      include: {
        user: {
          select: { firstName: true, lastName: true, profile: true },
        },
      },
    });

    if (!reviews.length) {
      return res.status(404).json({
        success: false,
        message: "No reviews found for this service.",
      });
    }
    const overallRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1)
        : 0;

    res
      .status(200)
      .json({
        success: true,
        overallRating: parseFloat(overallRating),
        reviews,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5." });
    }

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    if (review.userId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this review.",
      });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        rating: rating !== undefined ? parseInt(rating) : review.rating,
        comment: comment !== undefined ? comment : review.comment,
      },
    });

    res.status(200).json({ success: true, updatedReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found." });
    }

    if (review.userId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review.",
      });
    }

    await prisma.review.delete({
      where: { id },
    });

    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

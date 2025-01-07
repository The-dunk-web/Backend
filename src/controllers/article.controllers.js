import prisma from "../db/connectDB.js";

export const createArticle = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    let image = null;

    if (req.file) {
      image = req.file.path;
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        image,
        authorId: req.userId,
      },
    });

    res.status(201).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllArticles = async (req, res) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    res.status(200).json({ success: true, articles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: { firstName: true, lastName: true },
        },
        likedBy: {
          select: { id: true },
        },
      },
    });

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found." });
    }

    res.status(200).json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required.",
      });
    }

    let image = null;

    if (req.file) {
      image = req.file.path;
    }

    const article = await prisma.article.findUnique({ where: { id } });

    if (image === null && article.image) {
      image = article.image;
    }

    if (!article || article.authorId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this article.",
      });
    }

    const updatedArticle = await prisma.article.update({
      where: { id },
      data: { title, content, image },
    });

    res.status(200).json({ success: true, article: updatedArticle });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({ where: { id } });

    if (!article || article.authorId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this article.",
      });
    }

    await prisma.article.delete({ where: { id } });

    res
      .status(200)
      .json({ success: true, message: "Article deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const likeOrUnlikeArticle = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({ where: { id } });

    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found." });
    }

    const userLiked = await prisma.article.findFirst({
      where: {
        id,
        likedBy: { some: { id: req.userId } },
      },
    });

    if (userLiked) {
      await prisma.article.update({
        where: { id },
        data: {
          likes: { decrement: 1 },
          likedBy: {
            disconnect: { id: req.userId },
          },
        },
      });
      return res
        .status(200)
        .json({ success: true, message: "Article unliked." });
    }

    await prisma.article.update({
      where: { id },
      data: {
        likes: { increment: 1 },
        likedBy: {
          connect: { id: req.userId },
        },
      },
    });

    res.status(200).json({ success: true, message: "Article liked." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getLikedArticles = async (req, res) => {
  try {
    console.log("User ID:", req.userId);

    const likedArticles = await prisma.article.findMany({
      where: {
        likedBy: { some: { id: req.userId } },
      },
      include: {
        author: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    console.log("Liked Articles:", likedArticles);

    if (likedArticles.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No liked articles found." });
    }

    res.status(200).json({ success: true, likedArticles });
  } catch (error) {
    console.error("Error fetching liked articles:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

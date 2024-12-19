import prisma from "../db/connectDB.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

export const signup = async (req, res) => {
  const { firstName, lastName, password, email, phone } = req.body;

  try {
    if (!email || !password || !firstName || !lastName || !phone) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await prisma.User.findUnique({
      where: { email },
    });
    if (userAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = await prisma.User.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
      },
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...newUser,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

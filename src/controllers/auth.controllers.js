import prisma from "../db/connectDB.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import crypto from "crypto";

export const signup = async (req, res) => {
  const { firstName, lastName, password, email, phone } = req.body;
  try {
    if (!email || !password || !firstName || !lastName || !phone) {
      throw new Error("All fields are required");
    }

    let profilePictureUrl = null;

    if (req.file) {
      profilePictureUrl = req.file.path;
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
        profile: profilePictureUrl,
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

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user.id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

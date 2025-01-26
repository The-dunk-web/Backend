import prisma from "../db/connectDB.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/sendEmails.js";

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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    await prisma.user.update({
      where: { email: email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: new Date(resetTokenExpiresAt),
      },
    });

    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password required" });
    }

    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token },
    });

    if (!user || new Date(user.resetPasswordExpiresAt) < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcryptjs.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Error in changePassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { firstName, lastName, phone } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    let profilePictureUrl = null;

    if (req.file) {
      profilePictureUrl = req.file.path;
    }

    if (profilePictureUrl === null) {
      profilePictureUrl = user.profile;
    }

    const updated_user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        phone: phone || user.phone,
        profile: profilePictureUrl,
      },
      include: { visaCards: true },
    });

    res.status(200).json({
      success: true,
      user: { ...updated_user, password: undefined }, // password is not sent
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.log("Error in editProfile ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { visaCards: true },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        ...user,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in getProfile ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

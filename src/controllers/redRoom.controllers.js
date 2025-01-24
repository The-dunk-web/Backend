import prisma from "../db/connectDB.js";
import { sendRedRoomAnnouncementEmail } from "../utils/sendEmails.js";

export const sendEmails = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    users.forEach(async (user) => {
      await sendRedRoomAnnouncementEmail(user.email);
    });

    res.status(200).json({ success: true, message: "Emails sent" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

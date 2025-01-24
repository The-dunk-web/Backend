import transporter from "../config/nodeMailer.config.js";
import { passwordResetTemplate } from "./EmailTemplates/passwordReset.js";
import { RedRoomTemplate } from "./EmailTemplates/redRoom.js";

export const sendPasswordResetEmail = async (email, link) => {
  const htmlTemplate = passwordResetTemplate(link);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Link",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export const sendRedRoomAnnouncementEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "The Red Room is Now Open!",
    html: RedRoomTemplate,
  };

  await transporter.sendMail(mailOptions);
};

import transporter from "../config/nodeMailer.config.js";

export const sendPasswordResetEmail = async (email, link) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Link",
    text: `Click on the link to reset your password: ${link}`,
  };

  await transporter.sendMail(mailOptions);
};

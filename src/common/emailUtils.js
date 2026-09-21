import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAILTRAP_FROM_EMAIL,
    pass: process.env.MAILTRAP_PASSWORD,
  },
});

const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail(
    {
      from: process.env.MAILTRAP_FROM_EMAIL,
      to: email,
      subject: "Email Verification OTP",
      html: `
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire at ${otpExpiresAt.toLocaleTimeString()}.</p>
    `,
    },
    (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    },
  );
};

export const sendPasswordResetOtpEmail = async (
  email,
  otp,
  expiresInMinutes,
) => {
  // No callback => nodemailer returns a promise, so callers can catch failures.
  await transporter.sendMail({
    from: process.env.MAILTRAP_FROM_EMAIL,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <h2>Password Reset</h2>
      <p>Use this OTP to reset your password:</p>
      <h1>${otp}</h1>
      <p>This OTP will expire in ${expiresInMinutes} minutes.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `,
  });
};

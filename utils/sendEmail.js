// import nodemailer from "nodemailer";

// export const sendOTPEmail = async (email, otp) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: false,
//     auth: {
//       user: process.env.SMTP_EMAIL,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   await transporter.sendMail({
//     from: `"Mock Practice" <${process.env.SMTP_EMAIL}>`,
//     to: email,
//     subject: "Verify your email",
//     html: `
//       <h2>Email Verification</h2>
//       <p>Your OTP is:</p>
//       <h1>${otp}</h1>
//       <p>Valid for 10 minutes</p>
//     `,
//   });
// };












import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "Mock Practice <no-reply@mockp.in>",
      to: email,
      subject: "Verify your email",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes</p>
      `,
    });
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw new Error("Email sending failed");
  }
};

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
      from: "MockP <no-reply@mockp.in>",
      to: email,
      subject: "Verify Your Email Address – MockP",
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">

    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="margin: 0;">
        <span style="color: #16a34a;">Mock</span><span style="color: #111;">P</span>
      </h2>
      <p style="margin: 0; font-size: 12px; color: #6b7280;">
        Practice Platform
      </p>
    </div>

    <p>Hello,</p>

    <p>Thank you for registering with <strong>MockP</strong>.</p>

    <p>Please use the One-Time Password (OTP) below to verify your email address:</p>

    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background: #f3f4f6; padding: 10px 20px; border-radius: 6px;">
        ${otp}
      </span>
    </div>

    <p style="text-align: center; color: #6b7280;">
      This OTP is valid for 10 minutes.
    </p>

    <hr style="margin: 30px 0;" />



    <p style="font-size: 12px; color: #888; text-align: center;">
      © ${new Date().getFullYear()} MockP. All rights reserved.
    </p>

  </div>
`
    });
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw new Error("Email sending failed");
  }
};

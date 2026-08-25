import transporter from "./mailer.js";
import "dotenv/config";

async function sendMail(email, subject, name, otp) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    text: `Hello ${name},

Thank you for registering.

Your verification code is: ${otp}

This code will expire in 5 minutes.

If you did not create this account, you can ignore this email.`
  });
}

export default {
  sendMail
};
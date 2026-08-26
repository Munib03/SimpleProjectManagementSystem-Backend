import transporter from "./mailer.js";
import "dotenv/config";

async function sendMail(email, subject, name, message) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    text: `Hello ${name},

${message}`
  });
}

export default {
  sendMail
};
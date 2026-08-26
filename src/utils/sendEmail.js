import transporter from "./mailer.js";

async function sendMail(email, subject, html) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject,
    html
  });
}

export default {
  sendMail
};
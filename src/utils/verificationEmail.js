import mailGenerator from "../utils/mailgen.js";

function generateVerificationEmail(name, otp) {
  const email = {
    body: {
      name,
      intro: [
        "Thank you for registering.",
        `Your verification code is: <h2>${otp}</h2>`,
        "This code will expire in 5 minutes."
      ],
      outro:
        "If you did not create this account, you can ignore this email."
    }
  };

  return mailGenerator.generate(email);
}

export default generateVerificationEmail;
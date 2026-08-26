import mailGenerator from "./mailgen.js";


function generateResetPasswordEmail(name, resetLink) {
  const email = {
    body: {
      name,
      intro: "You requested to reset your password.",
       action: {
        instructions: "Click the button below to reset your password:",
        button: {
          text: "Reset Password",
          link: resetLink
        }
      },
      outro: "This link will expire in 15 minutes. If you did not request a password reset, you can ignore this email."
    }
  };

  return mailGenerator.generate(email);
}

export default generateResetPasswordEmail;
import userServices from "../services/userServices.js";
import { registerUserSchema } from "../validators/userValidators.js";


async function registerUser(req, res) {
  try {
    const userInputValidation = await registerUserSchema.safeParseAsync(req.body);
    if (userInputValidation.error) {
      return res.status(400).json({
        message: userInputValidation.error.format()
      });
    }

    const { firstname, lastname, email, password } = userInputValidation.data;
    const result = await userServices.registerUser(firstname, lastname, email, password);

    return res.status(201).json({
      message: "User is registered successfully, please verify your email address!",
      user: result
    });
  }
  catch(error) {
    console.log(error);

    return res.status(500 || error.statusCode).json({
      message: error.statusCode ? error.message : "Internel Server Error!"
    });
  }
}


export default {
  registerUser
}
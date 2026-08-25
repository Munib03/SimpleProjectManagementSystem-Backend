import userServices from "../services/userServices.js";
import { registerUserSchema, verifyRegisterUserSchema } from "../validators/userValidators.js";
import { generateToken } from "../utils/generateToken.js";


async function registerUser(req, res) {
  try {
    const userInputValidation = await registerUserSchema.safeParseAsync(req.body);
    if (userInputValidation.error) {
      return res.status(400).json({
        message: userInputValidation.error.format()
      });
    }

    const { firstname, lastname, email, role, password } = userInputValidation.data;
    await userServices.registerUser(firstname, lastname, email, password, role);

    return res.status(201).json({
      message: "User is registered successfully, please verify your email address!"
    });
  }
  catch(error) {
    console.log(error);

    return res.status(500 || error.statusCode).json({
      message: error.statusCode ? error.message : "Internel Server Error!"
    });
  }
}


async function verifyRegisteredEmailAddress(req, res) {
  try {
    const userInputValidation = await verifyRegisterUserSchema.safeParseAsync(req.body);
    if (userInputValidation.error) {
      return res.status(400).json({
        message: userInputValidation.error.format()
      });
    }

    const { email, code } = userInputValidation.data;
    const result = await userServices.verifyRegisteredEmailAddress(email, code);

    const payload = {
      id: result.id,
      email: result.email,
      role: result.role
    };
    const token = generateToken(payload) ;

    return res.status(200).json({
      message: "User is verified successfully!",
      token: token
    });
  } 
  catch (error) {
    console.log(error);
    
    return res.status(error.statusCode || 500).json({
      message: error.statusCode ? error.message : "Internel Server Error!"
    });
  }
}


export default {
  registerUser,
  verifyRegisteredEmailAddress
}
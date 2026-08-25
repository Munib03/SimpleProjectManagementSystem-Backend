import jwt from "jsonwebtoken";
import "dotenv/config";


export const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);

  return token;
}
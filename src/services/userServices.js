import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";


async function registerUser(firstname, lastname, email, password) {
  const userExist = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (userExist) {
    const error = new Error(`User with email [${email}] already exists!`);
    error.statusCode = 400;
    throw error;
  }


  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword
    },
    omit: {
      password: true, 
      isEmailVerified: true,
      updatedAt: true
    }
  });

  return user;
}


export default {
  registerUser
}
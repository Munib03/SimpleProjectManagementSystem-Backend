import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import redis from "../utils/redis.js";
import crypto from "crypto";
import mailer from "../utils/sendEmail.js";
import { userRoles } from "../utils/userRoles.js";


async function registerUser(firstname, lastname, email, password, role) {
  const userExist = await prisma.user.findUnique({
    where: {
      email: email,
    }
  });

  if (userExist) {
    if (userExist.isEmailVerified === false) {
      await prisma.user.delete({
        where: {
          email: email
        }
      });
    }

    else {
      const error = new Error(`User with email [${email}] already exists!`);
      error.statusCode = 400;
      throw error;
    }
  }

  else if (role !== userRoles.admin && role !== userRoles.user) {
    const error = new Error(`Role can be [Admin, User]!`);
    error.statusCode = 400;
    throw error;
  }

  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword,
      role: role
    },
    omit: {
      password: true, 
      isEmailVerified: true,
      updatedAt: true
    }
  });


  const otp = crypto.randomInt(100000, 1000000).toString();
  await redis.set(
    `email-verification ${email}`,
    otp,
    {
      EX: 500
    }
  );

  await mailer.sendMail(email, "Verify Your email", `${firstname} ${lastname}`, otp);

  return user;
}


async function verifyRegisteredEmailAddress(email, code) {
  const userExist = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (!userExist) {
    const error = new Error(`User with email [${email}] does not exist, please try to register!`);
    error.statusCode = 400;
    throw error;
  }

  const otp = await redis.get(`email-verification ${email}`);
  if (!otp) {
    const error = new Error(`OTP expired or invalid!`);
    error.statusCode = 400;
    throw error;
  }

  else if (otp !== code) {
    const error = new Error(`Invalid OTP`);
    error.statusCode = 400;
    throw error;
  }

  await prisma.user.update({
    where: {
      email: email
    },
    data: {
      isEmailVerified: true
    }
  })

  await redis.del(`email-verification ${email}`);

  return userExist;
}


export default {
  registerUser,
  verifyRegisteredEmailAddress
}
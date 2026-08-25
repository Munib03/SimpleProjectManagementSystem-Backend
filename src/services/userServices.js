import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import redis from "../utils/redis.js";
import crypto from "crypto";
import mailer from "../utils/sendEmail.js";


async function registerUser(firstname, lastname, email, password) {
  const userExist = await prisma.user.findUnique({
    where: {
      email: email,
    }
  });

  if (userExist?.isEmailVerified) {
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
}


export default {
  registerUser,
  verifyRegisteredEmailAddress
}
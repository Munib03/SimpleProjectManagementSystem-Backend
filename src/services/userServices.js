import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import redis from "../utils/redis.js";
import crypto from "crypto";
import mailer from "../utils/sendEmail.js";
import { userRoles } from "../utils/userRoles.js";
import { generateToken } from "../utils/generateToken.js";
import generateResetPasswordEmail from "../utils/resetPassword.js"
import generateVerificationEmail from "../utils/verificationEmail.js";


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

  const html = generateVerificationEmail(
    `${firstname} ${lastname}`,
    otp
  );

  await mailer.sendMail(
    email,
    "Verify Your Email",
    html
  );
  
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

  const payload = {
    id: userExist.id,
    email: userExist.email,
    role: userExist.role
  };
  const token = generateToken(payload);

  return token;
}


async function loginUser(email, password) {
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (!user) {
    const error = new Error(`User with email [${email}] does not exist!`);
    error.statusCode = 404;
    throw error;
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    const error = new Error(`Incorrect Password`);
    error.statusCode = 400;
    throw error;
  }
  
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };

  const token = generateToken(payload);

  return token;
}


async function resendEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (!user) {
    const error = new Error(`User does not exist!`);
    error.statusCode = 400;
    throw error;
  } 

  else if (user.isEmailVerified === true) {
    const error = new Error(`User is already verified!`);
    error.statusCode = 400;
    throw error;
  }

  const otp = crypto.randomInt(100000, 1000000).toString();
  await redis.set(
    `email-verification ${email}`, 
    otp,
    {
      EX: 500
    } 
  );

  const html = generateVerificationEmail(
    `${firstname} ${lastname}`,
    otp
  );

  await mailer.sendMail(
    email,
    "Verify Your Email",
    html
  );

  return user;
}


async function forgotPassword(email) {
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (!user) {
    const error = new Error(`User with email [${email}] does not exist!`);
    error.statusCode = 404;
    throw error;
  }

  
  const resetToken = crypto.randomBytes(32).toString("hex");
  await redis.set(
    `password-reset${resetToken}`,
    user.id,
    {
      EX: 15 * 60
    }
  );


  const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
  const html = generateResetPasswordEmail(
    `${user.firstname} ${user.lastname}`,
    resetLink
  );

  await mailer.sendMail(
    email,
    "Reset your password",
    html
  );
}


async function resetPassword(token, newPassword) {
  const userId = await redis.get(`password-reset${token}`);
  if (!userId) {
    const error = new Error(`Invalid Token or Expired!`);
    error.statusCode = 400;
    throw error;
  }


  var now = new Date();
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      password: hashedPassword,
      updatedAt: now
    }
  });

  await redis.del(`password-reset${token}`);
}



export default {
  registerUser,
  verifyRegisteredEmailAddress,
  loginUser,
  resendEmail,
  forgotPassword,
  resetPassword
}
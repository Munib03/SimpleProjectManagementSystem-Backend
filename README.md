# Project Management System

A backend REST API for a Project Management System built with Node.js, Express, PostgreSQL, Prisma, Redis, JWT, Zod, Nodemailer, and Mailgen.

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Prisma ORM
* Redis
* JWT
* Zod
* bcrypt
* Nodemailer
* Mailgen

## Features

* User registration and login
* JWT-based authentication
* Role-based users
* Email verification with OTP
* Resend verification code
* Forgot password
* Password reset
* Password hashing with bcrypt
* Request validation with Zod
* Rate limiting
* Redis for temporary data
* Email notifications

## Installation

```bash
npm install
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Make sure PostgreSQL and Redis are running.

Start the server:

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| POST   | `/user/register`            | Register a user         |
| POST   | `/user/verify-register`     | Verify email            |
| POST   | `/user/resend-verification` | Resend verification OTP |
| POST   | `/user/login`               | Login                   |
| POST   | `/user/forgot-password`     | Request password reset  |
| POST   | `/user/reset-password`      | Reset password          |

## Current Status

Authentication and user management are currently implemented.

Project and task management features are not implemented yet.


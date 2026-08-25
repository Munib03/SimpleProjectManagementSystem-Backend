import { email, z } from "zod";


export const registerUserSchema = z.object({
  firstname: z
    .string()
    .trim()
    .min(3, "Firstname must be atleast 3 characters!"),

  lastname: z 
    .string()
    .trim()
    .min(3, "Lastname must be atleast 3 characters!"),

  email: z 
    .string()
    .trim()
    .email("Invalid Email Address")
    .toLowerCase(),

  password: z 
    .string()
    .min(8, "Password should be atleast 8 characters!")
    .max(20, "Password must be at max 20 characters!")
});
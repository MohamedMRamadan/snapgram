import { z } from "zod";

export const SignupValidation = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  username: z.string().min(2, { message: "User name is too short" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
export const SigninValidation = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
export const PostValidaton = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
});
export const userProfileValidation = z.object({
  name: z.string().min(5).max(2200),
  username: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  email: z.string().email(),
  bio: z.string().min(5).max(2200),
});

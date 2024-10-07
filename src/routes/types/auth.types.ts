import { z } from "zod";

export const SignUpRequestSchema = z.object({
  username: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(8) 
})

export type SignUpRequestType = z.infer<typeof SignUpRequestSchema>

export const SignInRequestSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(8)
})

export type SignInRequestType = z.infer<typeof SignInRequestSchema>

import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller";
import { validate } from "../middleware/validateBody";
import { SignInRequestSchema, SignUpRequestSchema } from "./types/auth.types";

export const authRouter = Router()

authRouter.post("/signup", validate(SignUpRequestSchema), signup)
authRouter.post("/signin", validate(SignInRequestSchema), signin)

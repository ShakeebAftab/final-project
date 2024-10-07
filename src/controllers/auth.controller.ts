import { CustomRequest } from "../utils/customRequest";
import { Response } from "express";
import { logger } from "../utils/logger";
import { newError, respHandler, serverError } from "../utils/respHandler";
import { UserTable } from "../models/user";
import { unwrapOrThrow } from "../utils/option";
import { handleAsync } from "../utils/asyncHandler";
import { db } from "../database/db";
import { hash, verify } from "argon2";
import { sign } from "jsonwebtoken";
import { EnvKeys, getEnvValue } from "../utils/envHandler";
import {
  SignInRequestType,
  SignUpRequestType,
} from "../routes/types/auth.types";

export const signup = async (
  req: CustomRequest<SignUpRequestType>,
  res: Response
) => {
  try {
    const { password, username } = req.body;
    const email = req.body.email.toLowerCase();

    const checkUser = unwrapOrThrow(
      await handleAsync(
        db.query.UserTable.findFirst({
          where: (fields, { eq }) => eq(fields.email, email),
        })
      )
    );

    if (checkUser)
      return respHandler({
        req,
        res,
        status: 400,
        data: newError(email, "User already exists", "email", "BODY"),
      });

    const hashedPassword = unwrapOrThrow(await handleAsync(hash(password)));

    const user = unwrapOrThrow(
      await db
        .insert(UserTable)
        .values({
          username,
          email,
          password: hashedPassword,
        })
        .returning({ userId: UserTable.userId })
    );

    return respHandler({ req, res, status: 201, data: { user } });
  } catch (error) {
    logger.error(JSON.stringify(error, null, 2));
    return respHandler({ req, res, status: 500, data: serverError });
  }
};

export const signin = async (
  req: CustomRequest<SignInRequestType>,
  res: Response
) => {
  try {
    const { password } = req.body;
    const email = req.body.email.toLowerCase();

    const checkUser = unwrapOrThrow(
      await handleAsync(
        db.query.UserTable.findFirst({
          where: (fields, { eq }) => eq(fields.email, email),
        })
      )
    );

    if (!checkUser)
      return respHandler({
        req,
        res,
        status: 400,
        data: newError(email, "Access Denied", "email", "BODY"),
      });

    const verifyPass = verify(checkUser.password, password);
    if (!verifyPass)
      return respHandler({
        req,
        res,
        status: 400,
        data: newError(email, "Access Denied", "email", "BODY"),
      });

    const token = sign(
      { userId: checkUser.userId },
      getEnvValue(EnvKeys.jwt_secret),
      {
        expiresIn: 86400,
      }
    );

    return respHandler({ req, res, status: 200, data: { token } });
  } catch (error) {
    logger.error(JSON.stringify(error, null, 2));
    return respHandler({ req, res, status: 500, data: serverError });
  }
};

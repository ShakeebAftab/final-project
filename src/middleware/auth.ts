import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { EnvKeys, getEnvValue } from "../utils/envHandler";
import { unwrapOrThrow } from "../utils/option";
import { handleAsync } from "../utils/asyncHandler";
import { db } from "../database/db";
import { newError, respHandler, serverError } from "../utils/respHandler";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1] || null;

    if (!token)
      return respHandler({
        req,
        res,
        status: 401,
        data: newError("", "Unauthorized", "authorization", "HEADERS"),
      });

    const decoded = verify(token, getEnvValue(EnvKeys.jwt_secret)) as {
      userId: string;
    };

    const user = unwrapOrThrow(
      await handleAsync(
        db.query.UserTable.findFirst({
          where: (fields, { eq }) => eq(fields.userId, decoded.userId),
        })
      )
    );

    if (!user)
      return respHandler({
        req,
        res,
        status: 401,
        data: newError("", "Unauthorized", "authorization", "HEADERS"),
      });

    req.user = user;
    return next();
    next();
  } else {
    return respHandler({
      req,
      res,
      status: 500,
      data: serverError,
    });
  }
};

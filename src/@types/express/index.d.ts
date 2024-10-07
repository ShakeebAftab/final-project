import { Request } from "express";
import { SelectUserType } from "../../models/user";

declare module "express-serve-static-core" {
  interface Request {
    user: SelectUserType;
  }
}

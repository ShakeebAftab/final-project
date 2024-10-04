import { Request } from "express";
import { ParamsDictionary, Query } from "express-serve-static-core";

export interface CustomRequest<
  T = null,
  U extends ParamsDictionary = ParamsDictionary,
  V extends Query = Query
> extends Request {
  body: T;
  params: U;
  query: V;
}

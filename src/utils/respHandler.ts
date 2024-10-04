import { Request, Response } from "express";

// Error data types
type ErrorValue = string | number;
type ErrorLocation =
  | "HEADERS"
  | "BODY"
  | "QUERY"
  | "PARAMS"
  | "SERVER"
  | "REQUEST";

interface Error<T> {
  value: ErrorValue;
  msg: string;
  param: T;
  location: ErrorLocation;
}

// Creates new error message
export const newError = <T>(
  value: string | number,
  msg: string,
  param: keyof T,
  location: ErrorLocation
): Error<keyof T> => ({
  value,
  msg,
  param,
  location,
});

export const serverError: Error<""> = {
  location: "SERVER",
  msg: "Server Error",
  param: "",
  value: "",
};

type RespType = {
  req?: Request;
  res: Response;
  data: any;
  status: 200 | 201 | 400 | 401 | 403 | 500;
};

export const respHandler = ({ res, data, status }: RespType) =>
  res.status(status).json(data);

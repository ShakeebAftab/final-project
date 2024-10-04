import { ZodSchema } from "zod";
import { newError } from "./respHandler";

export const validate = (schema: ZodSchema, values: unknown) => {
  try {
    schema.parse(values);
    return null;
  } catch (error) {
    return newError<any>("", "Invalid Fields", "", "SERVER");
  }
};

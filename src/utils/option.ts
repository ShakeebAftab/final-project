export type None = "None";

export type Option<T> = T | None;

export const none: None = "None";

export const some = <T>(value: T): Option<T> => value;

export const isNone = <T>(option: Option<T>): option is None => option === none;

export const isSome = <T>(option: Option<T>): option is T => option !== none;

export const unwrapOrThrow = <T>(option: Option<T>): T => {
  if (isNone(option)) {
    throw new Error("Cannot unwrap None");
  }
  return option;
};

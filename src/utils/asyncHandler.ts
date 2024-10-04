import { none, Option } from "./option"

export const handleAsync = async <T>(
  promise: Promise<T>
): Promise<Option<T>> => {
  try {
    return await promise; 
  } catch (error) {
    return none
  }
};

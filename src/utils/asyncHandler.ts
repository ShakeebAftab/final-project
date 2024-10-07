import { logger } from "./logger";
import { none, Option } from "./option"

export const handleAsync = async <T>(
  promise: Promise<T>
): Promise<Option<T>> => {
  try {
    return await promise; 
  } catch (error) {
    console.log(error)
    logger.error(JSON.stringify(error, null, 2))
    return none
  }
};

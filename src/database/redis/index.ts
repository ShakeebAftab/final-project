import { createClient } from "redis";
import { EnvKeys, getEnvValue } from "../../utils/envHandler";

const client = createClient({ url: getEnvValue(EnvKeys.redis_url) });

client.on("connect", () => console.log("Connected to Redis"));
client.on("error", (error) => console.log(error));
client.connect().catch((err) => console.log(err));

export const redisSet = (key: string, value: string, expiry: number) =>
  new Promise(async (res, rej) => {
    try {
      await client.setEx(key, expiry, value);
      return res(null);
    } catch (error) {
      return rej(error);
    }
  });

export const redisGet = (key: string) =>
  new Promise(async (res, rej) => {
    try {
      const value = await client.get(key);
      return res(value);
    } catch (error) {
      return rej(error);
    }
  });

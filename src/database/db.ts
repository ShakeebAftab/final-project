import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { EnvKeys, getEnvValue } from "../utils/envHandler";

const postgresClient = postgres({
  host: getEnvValue(EnvKeys.db_host),
  database: getEnvValue(EnvKeys.db_name),
  username: getEnvValue(EnvKeys.db_user),
  password: getEnvValue(EnvKeys.db_pass),
  port: 5432,
  max: 1,
});
export const db = drizzle(postgresClient, {
  logger: getEnvValue(EnvKeys.node_env) === "dev",
});

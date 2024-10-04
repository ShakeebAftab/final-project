import { defineConfig } from "drizzle-kit";
import { EnvKeys, getEnvValue } from "../utils/envHandler";

export default defineConfig({
  schema: "./src/models/*.ts",
  out: "./src/database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    host: getEnvValue(EnvKeys.db_host),
    database: getEnvValue(EnvKeys.db_name),
    user: getEnvValue(EnvKeys.db_user),
    password: getEnvValue(EnvKeys.db_pass),
    port: 5432,
    ssl: false,
  },
  verbose: getEnvValue(EnvKeys.node_env) === "dev",
  strict: true,
});

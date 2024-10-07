import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { EnvKeys, getEnvValue } from "../utils/envHandler";
import { userRelations, UserTable } from "../models/user";
import { gameRelations, GameTable } from "../models/game";
import { historyRelations, HistoryTable } from "../models/histroy";

const postgresClient = postgres({
  host: getEnvValue(EnvKeys.db_host),
  database: getEnvValue(EnvKeys.db_name),
  username: getEnvValue(EnvKeys.db_user),
  password: getEnvValue(EnvKeys.db_pass),
  port: 5432,
  max: 1,
});

export const db = drizzle(postgresClient, {
  schema: {
    UserTable,
    userRelations,
    GameTable,
    gameRelations,
    HistoryTable,
    historyRelations,
  },
  logger: getEnvValue(EnvKeys.node_env) === "dev",
});

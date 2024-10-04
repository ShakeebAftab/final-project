import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { EnvKeys, getEnvValue } from "../utils/envHandler";
import postgres from "postgres";

// for migrations
const migrationClient = postgres({
  host: getEnvValue(EnvKeys.db_host),
  database: getEnvValue(EnvKeys.db_name),
  user: getEnvValue(EnvKeys.db_user),
  password: getEnvValue(EnvKeys.db_pass),
  max: 1,
});

const migrateDb = async () => {
  try {
    await migrate(drizzle(migrationClient), {
      migrationsFolder: "src/database/migrations",
    });
    await migrationClient.end();
    console.log("Migrations completed successfully");
  } catch (error) {
    console.log(error);
  }
};

migrateDb().catch((error) => {
  throw error;
});

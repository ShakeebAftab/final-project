import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const UserTable = pgTable("user", {
  id: uuid("id").primaryKey(),
  name: text("name"),
});

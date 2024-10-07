import { relations, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { index, pgTable, text, uuid } from "drizzle-orm/pg-core";
import { GameTable } from "./game";
import { createInsertSchema } from "drizzle-zod";

export const UserTable = pgTable(
  "user",
  {
    userId: uuid("userId").primaryKey().defaultRandom(),
    username: text("username").notNull(),
    email: text("email").unique().notNull(),
    password: text("password").notNull(),
  },
  (table) => ({
    emailIndex: index("emailIndex").on(table.email),
    usernameIndex: index("usernameIndex").on(table.username),
  })
);

export const userRelations = relations(UserTable, ({ many }) => ({
  games: many(GameTable),
}));

export type InsertUserType = InferInsertModel<typeof UserTable>;
export type SelectUserType = InferSelectModel<typeof UserTable>;
export type UpdateUserType = Partial<InsertUserType>;

export const InsertUserSchema = createInsertSchema(UserTable);

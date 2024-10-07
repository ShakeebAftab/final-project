import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { UserTable } from "./user";
import { relations } from "drizzle-orm";
import { HistoryTable } from "./histroy";

export const state = pgEnum("state", ["IN_PROGRESS", "LOST", "WON"]);

export const GameTable = pgTable(
  "game",
  {
    gameId: uuid("gameId").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    userId: uuid("userId")
      .references(() => UserTable.userId)
      .notNull(),
    turnNumber: integer("turnNumber").default(0).notNull(),
    score: integer("score").default(0),
    answer: text("answer").notNull(),
    state: state("state").default("IN_PROGRESS").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (table) => ({
    userIndex: index("userIndex").on(table.userId),
  })
);

export const gameRelations = relations(GameTable, ({ one, many }) => ({
  user: one(UserTable, {
    fields: [GameTable.userId],
    references: [UserTable.userId],
  }),

  history: many(HistoryTable),
}));

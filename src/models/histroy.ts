import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { GameTable } from "./game";
import { relations } from "drizzle-orm";

export const role = pgEnum("role", ["HUMAN", "AI"]);

export const HistoryTable = pgTable(
  "history",
  {
    historyId: uuid("historyId").primaryKey().defaultRandom(),
    gameId: uuid("gameId")
      .references(() => GameTable.gameId)
      .notNull(),
    msg: text("msg").notNull(),
    role: role("role").notNull(),
    createdAt: timestamp("createdAt").defaultNow(),
    updatedAt: timestamp("updatedAt").defaultNow(),
  },
  (table) => ({
    gameIndex: index("gameIndex").on(table.gameId),
  })
);

export const historyRelations = relations(HistoryTable, ({ one }) => ({
  game: one(GameTable, {
    fields: [HistoryTable.gameId],
    references: [GameTable.gameId],
  }),
}));

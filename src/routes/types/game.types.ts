import { z } from "zod";

export const GameTurnRequestSchema = z.object({
  country: z.string().describe("Name of the country to guess").min(1),
  gameId: z.string().describe("Id of the game").min(1),
});

export type GameTurnRequestType = z.infer<typeof GameTurnRequestSchema>;

export const GetSingleGameRequestSchema = z.object({
  gameId: z.string().describe("Id of the game").min(1),
});

export type GetSingleGameRequestType = z.infer<
  typeof GetSingleGameRequestSchema
>;

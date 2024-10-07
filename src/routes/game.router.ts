import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
  createNewGame,
  getAllUserGames,
  getScoreBoard,
  getSingleGame,
  handleTurn,
} from "../controllers/games.controller";
import { validate, validateParams } from "../middleware/validateBody";
import {
  GameTurnRequestSchema,
  GetSingleGameRequestSchema,
} from "./types/game.types";

export const gameRouter = Router();

gameRouter.post("/new", authMiddleware, createNewGame);
gameRouter.post(
  "/turn",
  [authMiddleware, validate(GameTurnRequestSchema)],
  handleTurn
);
gameRouter.get("/all", authMiddleware, getAllUserGames);
gameRouter.get(
  "/single/:gameId",
  [authMiddleware, validateParams(GetSingleGameRequestSchema)],
  getSingleGame
);
gameRouter.get("/scoreboard", authMiddleware, getScoreBoard);

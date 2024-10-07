import { Response } from "express";
import { CustomRequest } from "../utils/customRequest";
import { logger } from "../utils/logger";
import { newError, respHandler, serverError } from "../utils/respHandler";
import { initGamePipeline } from "../pipelines/initGame.pipeline";
import { handleAsync } from "../utils/asyncHandler";
import { isNone, none, unwrapOrThrow } from "../utils/option";
import { db } from "../database/db";
import { GameTable } from "../models/game";
import {
  GameTurnRequestType,
  GetSingleGameRequestType,
} from "../routes/types/game.types";
import { scoreTable } from "../utils/scoreTable";
import { hintGeneratorPipeline } from "../pipelines/hintGenerator.pipeline";
import { desc, eq, sql } from "drizzle-orm";
import { HistoryTable } from "../models/histroy";
import { UserTable } from "../models/user";

export const createNewGame = async (req: CustomRequest, res: Response) => {
  try {
    const { country } = unwrapOrThrow(
      await handleAsync(initGamePipeline.invoke({}))
    );

    const newGame = unwrapOrThrow(
      await handleAsync(
        db
          .insert(GameTable)
          .values({
            name: `Game`,
            answer: country.toLowerCase(),
            userId: req.user.userId,
            score: 0,
            turnNumber: 0,
          })
          .returning({ gameId: GameTable.gameId })
      )
    );

    return respHandler({ req, res, status: 201, data: { game: newGame } });
  } catch (error) {
    logger.error(JSON.stringify(error, null, 2));
    return respHandler({ req, res, status: 500, data: serverError });
  }
};

export const handleTurn = async (
  req: CustomRequest<GameTurnRequestType>,
  res: Response
) => {
  try {
    const { gameId } = req.body;
    const country = req.body.country.toLowerCase();

    const game = unwrapOrThrow(
      await handleAsync(
        db.query.GameTable.findFirst({
          where: (fields, { eq }) => eq(fields.gameId, gameId),
        })
      )
    );

    if (!game)
      return respHandler({
        req,
        res,
        status: 404,
        data: serverError,
      });

    if (game.state !== "IN_PROGRESS" || game.turnNumber >= 10)
      return respHandler({
        req,
        res,
        status: 400,
        data: newError("", "Game is over", "game", "BODY"),
      });

    if (game.answer === country.toLowerCase()) {
      unwrapOrThrow(
        await handleAsync(
          db.insert(HistoryTable).values({
            gameId,
            msg: country.toLowerCase(),
            role: "HUMAN",
          })
        )
      );

      unwrapOrThrow(
        await handleAsync(
          db
            .update(GameTable)
            .set({
              state: "WON",
              score: scoreTable[`${game.turnNumber + 1}`],
              turnNumber: game.turnNumber + 1,
            })
            .where(eq(GameTable.gameId, gameId))
        )
      );

      return respHandler({
        req,
        res,
        status: 200,
        data: { message: "Game Won!" },
      });
    }

    if (game.answer !== country && game.turnNumber + 1 === 10) {
      unwrapOrThrow(
        await handleAsync(
          db.insert(HistoryTable).values({
            gameId,
            msg: country.toLowerCase(),
            role: "HUMAN",
          })
        )
      );

      unwrapOrThrow(
        await handleAsync(
          db
            .update(GameTable)
            .set({
              state: "LOST",
              score: 0,
              turnNumber: game.turnNumber + 1,
            })
            .where(eq(GameTable.gameId, gameId))
        )
      );

      return respHandler({
        req,
        res,
        status: 200,
        data: { message: "Game Lost!" },
      });
    }

    unwrapOrThrow(
      await handleAsync(
        db.insert(HistoryTable).values({
          gameId,
          msg: country.toLowerCase(),
          role: "HUMAN",
        })
      )
    );

    const { hint } = unwrapOrThrow(
      await handleAsync(
        hintGeneratorPipeline.invoke({ country: game.answer, guess: country })
      )
    );

    const newHint = unwrapOrThrow(
      await handleAsync(
        db.transaction(async (tx) => {
          try {
            unwrapOrThrow(
              await handleAsync(
                tx
                  .update(GameTable)
                  .set({
                    turnNumber: game.turnNumber + 1,
                  })
                  .where(eq(GameTable.gameId, gameId))
              )
            );

            const dbHint = unwrapOrThrow(
              await handleAsync(
                tx
                  .insert(HistoryTable)
                  .values({
                    gameId,
                    msg: hint,
                    role: "AI",
                  })
                  .returning()
              )
            );

            return dbHint.length > 0 ? dbHint[0] : none;
          } catch (error) {
            logger.error(JSON.stringify(error, null, 2));
            tx.rollback();
            return none;
          }
        })
      )
    );

    if (isNone(newHint))
      return respHandler({
        req,
        res,
        status: 500,
        data: serverError,
      });

    return respHandler({ req, res, status: 200, data: { hint: newHint } });
  } catch (error) {
    logger.error(JSON.stringify(error, null, 2));
    return respHandler({ req, res, status: 500, data: serverError });
  }
};

export const getAllUserGames = async (req: CustomRequest, res: Response) => {
  try {
    const games = unwrapOrThrow(
      await handleAsync(
        db.query.GameTable.findMany({
          where: (fields, { eq }) => eq(fields.userId, req.user.userId),
          orderBy: (fields) => desc(fields.createdAt),
          columns: {
            answer: false,
          },
        })
      )
    );

    return respHandler({ req, res, status: 200, data: { games } });
  } catch (error) {
    logger.error(JSON.stringify(error, null, 2));
    return respHandler({ req, res, status: 500, data: serverError });
  }
};

export const getSingleGame = async (
  req: CustomRequest<null, GetSingleGameRequestType>,
  res: Response
) => {
  try {
    const { gameId } = req.params;

    const game = unwrapOrThrow(
      await handleAsync(
        db.query.GameTable.findFirst({
          where: (fields, { eq, and }) =>
            and(eq(fields.gameId, gameId), eq(fields.userId, req.user.userId)),
          columns: {
            answer: false,
          },
          with: { history: true },
        })
      )
    );

    if (!game)
      return respHandler({
        req,
        res,
        status: 404,
        data: serverError,
      });

    return respHandler({ req, res, status: 200, data: { game } });
  } catch (error) {
    logger.error(JSON.stringify(error, null, 2));
    return respHandler({ req, res, status: 500, data: serverError });
  }
};

export const getScoreBoard = async (req: CustomRequest, res: Response) => {
  try {
    const scoreBoard = unwrapOrThrow(
      await handleAsync(
        db
          .select({
            totalScore: sql<number>`SUM(${GameTable.score})`.as("totalScore"),
            username: UserTable.username,
          })
          .from(GameTable)
          .where(eq(GameTable.state, "WON"))
          .groupBy(GameTable.userId, UserTable.username)
          .orderBy(desc(sql`"totalScore"`))
          .leftJoin(UserTable, eq(GameTable.userId, UserTable.userId))
      )
    );

    return respHandler({ req, res, status: 200, data: { scoreBoard } });
  } catch (error) {
    logger.error(JSON.stringify(error, null, 2));
    return respHandler({ req, res, status: 500, data: serverError });
  }
};

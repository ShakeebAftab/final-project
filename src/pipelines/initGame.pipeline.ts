import { RunnableSequence } from "@langchain/core/runnables";
import { model } from "../utils/model";
import { GameInitOutputSchema } from "./types/gameInit.types";
import { gameInitPrompt } from "./prompts/gameInit.prompts";

export const initGamePipeline = RunnableSequence.from([
  gameInitPrompt,
  model.withStructuredOutput(GameInitOutputSchema),
]);

import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { model } from "../utils/model";
import {
  HintGeneratorInputType,
  HintGeneratorOutputSchema,
} from "./types/hintGenerator.types";
import { hintGeneratorPrompt } from "./prompts/hintGenerator.prompts";

export const hintGeneratorPipeline = RunnableSequence.from([
  {
    hint: new RunnablePassthrough<HintGeneratorInputType>(),
    country: (hint) => hint.country,
    guess: (hint) => hint.guess,
  },
  hintGeneratorPrompt,
  model.withStructuredOutput(HintGeneratorOutputSchema),
]);

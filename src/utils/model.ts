import { ChatOpenAI } from "@langchain/openai";
import { EnvKeys, getEnvValue } from "./envHandler";

export const model = new ChatOpenAI({
  apiKey: getEnvValue(EnvKeys.openai_api_key),
  modelName: "gpt-4o",
});

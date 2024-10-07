import { PromptTemplate } from "@langchain/core/prompts";

export const gameInitPrompt = PromptTemplate.fromTemplate(
  "You're part of a game where the user have to guess a country name that you choose. Hence, you have to choose a country name that the user will guess. What country name would you like to choose? Pick something that is not too easy to guess, but not too hard either."
);

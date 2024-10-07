import { ChatPromptTemplate } from "@langchain/core/prompts";

export const hintGeneratorPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You're part of the game where user is guessing a country name. The correct answer is {country}. Give user hints to help them guess the country name based on their guess and the country name. Make sure to give useful hints!",
  ],
  ["user", "{guess}"],
]);

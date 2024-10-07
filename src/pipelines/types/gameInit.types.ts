import { z } from "zod";

export const GameInitOutputSchema = z.object({
   country: z.string().describe("Name of the country to guess").min(1)
})

export type GamInitOutputType = z.infer<typeof GameInitOutputSchema>

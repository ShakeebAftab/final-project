import { z } from "zod";

export const HintGeneratorInputSchema = z.object({
  country: z.string().min(1),
  guess: z.string().min(1),
});

export type HintGeneratorInputType = z.infer<typeof HintGeneratorInputSchema>;

export const HintGeneratorOutputSchema = z.object({
  hint: z.string().min(1),
});

export type HintGeneratorOutputType = z.infer<typeof HintGeneratorOutputSchema>;

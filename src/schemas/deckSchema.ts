
import { z } from "zod";

export const cardSchema = z.object({
  front: z.string().min(1, { message: "Front side text is required" }),
  back: z.string().min(1, { message: "Back side text is required" }),
  example: z.string().optional(),
  notes: z.string().optional(),
});

export const deckSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters long" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters long" }),
  category: z.string().min(1, { message: "Please select a category" }),
  color: z.string().default("bg-primary"),
  isPublic: z.boolean().default(false),
  cards: z.array(cardSchema).min(1, { message: "Add at least one card to your deck" }),
});

export type DeckFormValues = z.infer<typeof deckSchema>;

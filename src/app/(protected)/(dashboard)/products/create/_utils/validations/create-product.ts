import { z } from "zod";

export const createSpecificationsSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  barCode: z.string(),
  salePrice: z.number(),
  costPrice: z.number(),
  specifications: z.array(createSpecificationsSchema),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;

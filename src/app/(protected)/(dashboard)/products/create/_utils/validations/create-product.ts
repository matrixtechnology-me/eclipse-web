import { z } from "zod";

export const createSpecificationsSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const createVariationSchema = z.object({
  image: z.instanceof(File),
  salePrice: z.number(),
  costPrice: z.number(),
  specifications: z.array(createSpecificationsSchema),
});

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  variations: z.array(createVariationSchema),
});

export type CreateProductVariationSchema = z.infer<
  typeof createVariationSchema
>;
export type CreateProductSchema = z.infer<typeof createProductSchema>;

import { ESaleMovementPaymentMethod, ESaleMovementType } from "@prisma/client";
import { z } from "zod";

export const productSchema = z.object({
  id: z.string().min(1, { message: "seleção do item obrigatória." }),
  name: z.string().min(1, { message: "seleção do item obrigatória." }),
  salePrice: z.number().min(1, { message: "seleção do item obrigatória." }),
  costPrice: z.number().min(1, { message: "seleção do item obrigatória." }),
  quantity: z
    .string({ required_error: "quantidade do item obrigatória." })
    .refine((arg) => !isNaN(Number(arg)) && Number(arg) > 0, {
      message: "quantidade inválida.",
    }),
  /* discount: z.object({
    variant: z.enum(["percentage", "cash"], {
      required_error: "variante obrigatória.",
    }),
    amount: z.string({ required_error: "quantidade inválida." }).refine(
      (arg) => {
        const numericArg = Number(arg);
        return !isNaN(numericArg) && numericArg >= 0;
      },
      { message: "quantidade inválida." }
    ),
  }), */
});

export const receivingMethod = z.object({
  method: z.nativeEnum(ESaleMovementPaymentMethod),
  amount: z.number(),
});

export const createSaleSchema = z.object({
  customerId: z.string(),
  products: z.array(productSchema),
  receivingMethods: z.array(receivingMethod),
});

export type ProductSchema = z.infer<typeof productSchema>;
export type ReceivingMethodSchema = z.infer<typeof receivingMethod>;
export type CreateSaleSchema = z.infer<typeof createSaleSchema>;

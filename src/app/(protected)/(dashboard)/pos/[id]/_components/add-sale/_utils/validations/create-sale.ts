import { EPaymentMethod, ESaleMovementType } from "@prisma/client";
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

export const movementSchema = z.object({
  type: z.nativeEnum(ESaleMovementType),
  method: z.nativeEnum(EPaymentMethod),
  amount: z.number(),
});

export const createSaleSchema = z.object({
  customerId: z.string(),
  products: z.array(productSchema),
  movements: z.array(movementSchema),
});

export type ProductSchema = z.infer<typeof productSchema>;
export type MovementSchema = z.infer<typeof movementSchema>;
export type CreateSaleSchema = z.infer<typeof createSaleSchema>;

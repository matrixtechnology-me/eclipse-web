import { EPaymentMethod, ESaleMovementType } from "@prisma/client";
import { z } from "zod";

export const productSchema = z.object({
  productId: z.string().min(1, { message: "Seleção do item é obrigatória." }),
  name: z.string().min(1, { message: "Seleção do item é obrigatória." }),
  salePrice: z.number().min(1, { message: "Preço de venda é obrigatório." }),
  quantity: z
    .number({ required_error: "Quantidade do item é obrigatória." })
    .int("Apenas valores inteiros são permitidos.")
    .gt(0.0, "Quantidade inválida. Informe um valor numérico maior que zero."),
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

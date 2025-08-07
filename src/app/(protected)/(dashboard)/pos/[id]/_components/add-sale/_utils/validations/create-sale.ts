import { EPaymentMethod, ESaleMovementType } from "@prisma/client";
import { z } from "zod";

export const productSchema = z.object({
  productId: z.string().min(1, { message: "Seleção do item é obrigatória." }),
  name: z.string().min(1, { message: "Seleção do item é obrigatória." }),
  salePrice: z.number().min(1, { message: "Preço de venda é obrigatório." }),
  availableQty: z
    .number({ required_error: "Quantidade do item é obrigatória." })
    .int("Apenas valores inteiros são permitidos.")
    .gte(0.0, "Quantidade deve ser maior ou igual a zero."),
  quantity: z
    .number({ required_error: "Quantidade do item é obrigatória." })
    .int("Apenas valores inteiros são permitidos.")
    .gt(0.0, "Quantidade inválida. Informe um valor numérico maior que zero."),
  flatComposition: z.array(z.object({
    productId: z
      .string({ required_error: "Campo obrigatório." })
      .min(1, "Campo obrigatório."),
    usedQuantity: z
      .number({ required_error: "Quantidade do item é obrigatória." })
      .int("Apenas valores inteiros são permitidos.")
      .gt(0.0, "Quantidade deve ser maior que zero."),
    availableQty: z
      .number({ required_error: "Quantidade do item é obrigatória." })
      .int("Apenas valores inteiros são permitidos.")
      .gte(0.0, "Quantidade deve ser maior ou igual a zero."),
  })).min(1, "Deve conter pelo menos um item."),
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

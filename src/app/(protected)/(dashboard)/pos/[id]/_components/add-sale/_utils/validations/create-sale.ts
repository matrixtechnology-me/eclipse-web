import { EPaymentMethod, ESaleMovementType } from "@prisma/client";
import { z } from "zod";

export const productSchema = z.object({
  id: z.string().min(1, { message: "Seleção do item é obrigatória." }),
  name: z.string().min(1, { message: "Seleção do item é obrigatória." }),
  salePrice: z.number().min(1, { message: "Preço de venda é obrigatório." }),
  costPrice: z.number().min(1, { message: "Preço de custo é obrigatório." }),
  quantity: z
    .string({ required_error: "Quantidade do item é obrigatória." })
    .refine((arg) => !isNaN(Number(arg)) && Number(arg) > 0, {
      message: "Quantidade inválida. Informe um valor numérico maior que zero.",
    }),
  // discount: z.object({
  //   variant: z.enum(["percentage", "cash"], {
  //     required_error: "Tipo de desconto é obrigatório.",
  //   }),
  //   amount: z
  //     .string({ required_error: "Valor do desconto é obrigatório." })
  //     .refine(
  //       (arg) => {
  //         const numericArg = Number(arg);
  //         return !isNaN(numericArg) && numericArg >= 0;
  //       },
  //       { message: "Valor do desconto inválido." }
  //     ),
  // }),
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

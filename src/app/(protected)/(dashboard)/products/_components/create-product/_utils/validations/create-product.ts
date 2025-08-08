import { ProductionType } from "@prisma/client";
import { z } from "zod";

export const createProductSchema = z.object({
  product: z.object({
    name: z
      .string()
      .min(1, { message: "O nome do produto é obrigatório." })
      .max(100, {
        message: "O nome do produto deve ter no máximo 100 caracteres.",
      }),
    description: z
      .string()
      .max(255, { message: "A descrição deve ter no máximo 255 caracteres." })
      .default(""),
    barCode: z
      .string()
      .min(1, { message: "O código de barras é obrigatório." })
      .max(50, {
        message: "O código de barras deve ter no máximo 50 caracteres.",
      }),
    salePrice: z
      .number({ invalid_type_error: "Informe um valor válido." })
      .nonnegative({ message: "O preço de venda deve ser zero ou positivo." }),
    salable: z.boolean({ required_error: "Campo obrigatório." }),
    productionType: z
      .nativeEnum(ProductionType, {
        message: "Tipo de Produção é obrigatório.",
      }),
    composite: z.boolean({ required_error: "Campo obrigatório." }),
  }),
  stock: z.object({
    costPrice: z
      .number({ invalid_type_error: "Informe um valor válido." })
      .nonnegative({ message: "O preço de venda deve ser zero ou positivo." }),

    initialQuantity: z
      .number({ invalid_type_error: "Informe uma quantidade válida." })
      .int({ message: "A quantidade deve ser um número inteiro." })
      .nonnegative({ message: "A quantidade deve ser zero ou positiva." }),
    expiresAt: z.date().optional(),
  }).optional(),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;

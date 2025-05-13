import { z } from "zod";

export const createSpecificationsSchema = z.object({
  label: z
    .string()
    .min(1, { message: "O nome da variação é obrigatório." })
    .max(50, {
      message: "O nome da variação deve ter no máximo 50 caracteres.",
    }),
  value: z
    .string()
    .min(1, { message: "O valor da variação é obrigatório." })
    .max(100, {
      message: "O valor da variação deve ter no máximo 100 caracteres.",
    }),
});

export const createProductSchema = z.object({
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
  costPrice: z
    .number({ invalid_type_error: "Informe um valor válido." })
    .nonnegative({ message: "O preço de venda deve ser zero ou positivo." }),
  salePrice: z
    .number({ invalid_type_error: "Informe um valor válido." })
    .nonnegative({ message: "O preço de venda deve ser zero ou positivo." }),
  initialQuantity: z
    .number({ invalid_type_error: "Informe uma quantidade válida." })
    .int({ message: "A quantidade deve ser um número inteiro." })
    .nonnegative({ message: "A quantidade deve ser zero ou positiva." }),
  expiresAt: z.date().optional(),
  specifications: z.array(createSpecificationsSchema).optional().default([]),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;

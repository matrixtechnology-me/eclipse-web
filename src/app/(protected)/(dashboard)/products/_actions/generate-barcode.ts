"use server";

import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError } from "@/errors";
import prisma from "@/lib/prisma";

function generateRandomBarcode(): string {
  return Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join(
    ""
  );
}

type GenerateBarcodeActionResult = {
  barCode: string;
};

export const generateBarcodeAction: ServerAction<
  unknown,
  GenerateBarcodeActionResult
> = async () => {
  try {
    let unique = false;
    let barcode = "";

    while (!unique) {
      barcode = generateRandomBarcode();

      const existingProduct = await prisma.product.findUnique({
        where: { barCode: barcode },
        select: { id: true },
      });

      if (!existingProduct) unique = true;
    }

    return success({ barCode: barcode });
  } catch (error) {
    console.error(error);
    return failure(new InternalServerError("Erro ao gerar código de barras"));
  }
};

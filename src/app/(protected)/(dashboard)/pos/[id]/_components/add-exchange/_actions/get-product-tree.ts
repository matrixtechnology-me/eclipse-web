"use server";

import prisma from "@/lib/prisma";
import { InvalidParamError } from "@/errors/domain/invalid-param.error";
import { PrismaTransaction } from "@/lib/prisma/types";
import { StockLotUsage } from "@prisma/client";

export type ProductTree = {
  name: string;
  productId: string;
  quantity: number;
  children: ProductTree[];
} & ({
  root: true;
  saleProductId: string;
  stockLotUsages: StockLotUsage[];
} | {
  root?: never;
});

export const getProductTree = async (
  productId: string,
  tx: PrismaTransaction,
): Promise<ProductTree> => {
  const product = await tx.product.findUnique({
    where: { id: productId, deletedAt: null },
    include: { parentCompositions: true },
  });

  if (!product) throw new Error(`Product ${productId} does not exist.`);

  const tree: ProductTree = {
    productId,
    name: product.name,
    quantity: 0,
    children: [],
  };

  for (const { childId, totalQty } of product.parentCompositions) {
    let childTree = await getProductTree(childId, tx);
    childTree.quantity = totalQty.toNumber();

    tree.children.push(childTree);
  }

  return tree;
};

export const getSaleProductTrees = async (saleId: string) => {
  let productTrees: ProductTree[] = [];

  await prisma.$transaction(async (tx) => {
    const sale = await tx.sale.findUnique({
      where: { id: saleId, deletedAt: null },
      include: {
        products: { include: { stockLotUsages: true } },
      },
    });

    if (!sale) throw new InvalidParamError(`Sale ${saleId} does not exist.`);

    for (const saleProduct of sale.products) {
      let tree = await getProductTree(saleProduct.productId, tx);

      tree = {
        ...tree,
        root: true,
        saleProductId: saleProduct.id,
        quantity: saleProduct.totalQty,
        stockLotUsages: saleProduct.stockLotUsages,
      };

      productTrees.push(tree);
    }
  });

  return productTrees;
};
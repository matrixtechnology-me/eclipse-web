"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { PATHS } from "@/config/paths";
import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import {
  EMembershipRole,
  EPaymentMethod,
  EPosEventType,
  ESaleMovementType,
  EStockStrategy,
  Prisma,
} from "@prisma/client";
import moment from "moment";
import { revalidateTag } from "next/cache";

type CreatePosSaleActionPayload = {
  description: string;
  customerId: string;
  posId: string;
  products: {
    id: string;
    totalQty: number;
  }[];
  movements: {
    type: ESaleMovementType;
    method: EPaymentMethod;
    amount: number;
  }[];
  tenantId: string;
};

export const createPosSaleAction: ServerAction<
  CreatePosSaleActionPayload,
  unknown
> = async ({
  customerId,
  products,
  description,
  posId,
  tenantId,
  movements,
}) => {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });

    if (!tenant) return failure(new NotFoundError("tenant not found"));

    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
        tenantId,
      },
    });

    if (!customer) return failure(new NotFoundError("customer not found"));

    const pos = await prisma.pos.findUnique({
      where: {
        id: posId,
        tenantId,
      },
    });

    if (!pos) return failure(new NotFoundError("not found POS"));

    const mappedProducts = await Promise.all(
      products.map(async (saleProduct) => {
        const product = await prisma.product.findUnique({
          where: { id: saleProduct.id },
          include: { stock: { select: { id: true, strategy: true } } },
        });

        if (!product?.stock) {
          throw new NotFoundError("product stock not found");
        }

        const orderDirection =
          product.stock.strategy === EStockStrategy.Fifo ? "asc" : "desc";
        const [targetLot] = await prisma.stockLot.findMany({
          where: { stockId: product.stock.id },
          orderBy: { expiresAt: orderDirection },
          take: 1,
        });

        if (!targetLot) {
          throw new NotFoundError("No lots in product stock");
        }

        return {
          costPrice: targetLot.costPrice,
          description: product.description,
          name: product.name,
          productId: product.id,
          salePrice: product.salePrice,
          totalQty: saleProduct.totalQty,
          stockId: product.stock.id,
          stockLotId: targetLot.id,
        };
      })
    );

    const total = mappedProducts.reduce(
      (acc, saleProduct) =>
        acc + saleProduct.salePrice.toNumber() * saleProduct.totalQty,
      0
    );

    const mappedMovements = movements.map((movement) => {
      return movement;
    });

    const sale = await prisma.sale.create({
      data: {
        customerId,
        tenantId: pos.tenantId,
        products: {
          createMany: {
            data: mappedProducts.map(({ stockId, ...rest }) => rest),
          },
        },
        total,
      },
    });

    const posEventSale = await prisma.posEventSale.create({
      data: {
        amount: total,
        description,
        customer: {
          connect: {
            id: customerId,
          },
        },
        sale: {
          connect: {
            id: sale.id,
          },
        },
        products: {
          createMany: {
            data: mappedProducts.map(
              ({ stockId, stockLotId, ...rest }) => rest
            ),
          },
        },
        posEvent: {
          create: {
            type: EPosEventType.Sale,
            posId,
          },
        },
      } as Prisma.PosEventSaleCreateInput,
    });

    await Promise.all([
      mappedMovements.map(async (movement) => {
        const childProps = {
          amount: movement.amount,
          method: movement.method,
        };

        const childObj =
          movement.type === ESaleMovementType.Change
            ? {
                type: ESaleMovementType.Change,
                changes: {
                  create: {
                    ...childProps,
                  },
                },
              }
            : {
                type: ESaleMovementType.Payment,
                payments: {
                  create: {
                    ...childProps,
                  },
                },
              };

        const posEventSaleRef = {
          posEventSale: {
            connect: {
              id: posEventSale.id,
            },
          },
        };

        const saleRef = {
          sale: {
            connect: {
              id: sale.id,
            },
          },
        };

        await Promise.all([
          await prisma.posEventSaleMovement.create({
            data: {
              ...posEventSaleRef,
              ...childObj,
            },
          }),
          await prisma.saleMovement.create({
            data: {
              ...saleRef,
              ...childObj,
            },
          }),
        ]);
      }),
    ]);

    await Promise.all(
      mappedProducts.map(async ({ stockId, stockLotId, totalQty }) => {
        const decrement = { decrement: totalQty };

        await prisma.stock.update({
          where: { id: stockId },
          data: {
            availableQty: decrement,
            totalQty: decrement,
            lots: {
              update: {
                where: { id: stockLotId },
                data: { totalQty: decrement },
              },
            },
          },
        });
      })
    );

    const tenantOwner = await prisma.tenantMembership.findFirst({
      where: {
        tenantId,
        membership: {
          role: EMembershipRole.Owner,
        },
      },
      select: {
        membership: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (tenantOwner) {
      await prisma.notification.create({
        data: {
          body: `A Loja ${tenant.name} vendeu ${CurrencyFormatter.format(
            sale.total.toNumber()
          )} às ${moment(sale.createdAt).format(
            "HH:mm"
          )}. Bora conferir os detalhes?`,
          subject: `Venda feita para ${customer.name}! 💰`,
          href: PATHS.PROTECTED.DASHBOARD.SALES.SALE(sale.id).INDEX,
          targets: {
            createMany: {
              data: [
                {
                  tenantId,
                  userId: tenantOwner.membership.userId,
                },
              ],
              skipDuplicates: true,
            },
          },
        },
      });

      revalidateTag(
        CACHE_TAGS.USER_TENANT(tenantOwner.membership.userId, tenantId)
          .NOTIFICATIONS
      );
    }

    revalidateTag(CACHE_TAGS.TENANT(tenantId).POS.POS(posId).INDEX);

    return success({});
  } catch (error) {
    console.error(error);
    return failure(
      new InternalServerError(
        "cannot create a new pos sale event because error: " + error
      )
    );
  }
};

"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { PATHS } from "@/config/paths";
import { failure, Action, success } from "@/core/action";
import { InternalServerError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import {
  EMembershipRole,
  EPaymentMethod,
  EPosEventType,
  ESaleMovementType,
  EStockEventType,
  EStockStrategy,
  Prisma,
} from "@prisma/client";
import moment from "moment";
import { revalidateTag } from "next/cache";

type CreatePosSaleActionPayload = {
  description: string;
  customerId: string;
  posId: string;
  products: { id: string; totalQty: number }[];
  movements: {
    type: ESaleMovementType;
    method: EPaymentMethod;
    amount: number;
  }[];
  tenantId: string;
};

export const createPosSaleAction: Action<
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
    const [tenant, customer, pos] = await Promise.all([
      prisma.tenant.findUnique({ where: { id: tenantId } }),
      prisma.customer.findUnique({ where: { id: customerId, tenantId } }),
      prisma.pos.findUnique({ where: { id: posId, tenantId } }),
    ]);

    if (!tenant) return failure(new NotFoundError("tenant not found"));
    if (!customer) return failure(new NotFoundError("customer not found"));
    if (!pos) return failure(new NotFoundError("not found POS"));

    const mappedProducts = await Promise.all(
      products.map(async ({ id, totalQty }) => {
        const product = await prisma.product.findUnique({
          where: { id },
          include: { stock: { select: { id: true, strategy: true } } },
        });
        if (!product?.stock) throw new NotFoundError("product stock not found");

        const orderDirection =
          product.stock.strategy === EStockStrategy.Fifo ? "asc" : "desc";
        const [lot] = await prisma.stockLot.findMany({
          where: { stockId: product.stock.id },
          orderBy: { expiresAt: orderDirection },
          take: 1,
        });
        if (!lot) throw new NotFoundError("No lots in product stock");

        return {
          costPrice: lot.costPrice,
          description: product.description,
          name: product.name,
          productId: product.id,
          salePrice: product.salePrice,
          totalQty,
          stockId: product.stock.id,
          stockLotId: lot.id,
        };
      })
    );

    const total = mappedProducts.reduce(
      (sum, { salePrice, totalQty }) => sum + salePrice.toNumber() * totalQty,
      0
    );

    const sale = await prisma.sale.create({
      data: {
        customerId,
        tenantId,
        total,
        products: {
          createMany: {
            data: mappedProducts.map(({ stockId, ...rest }) => rest),
          },
        },
      },
    });

    const posEventSale = await prisma.posEventSale.create({
      data: {
        amount: total,
        description,
        customer: { connect: { id: customerId } },
        sale: { connect: { id: sale.id } },
        products: {
          createMany: {
            data: mappedProducts.map(
              ({ stockId, stockLotId, ...rest }) => rest
            ),
          },
        },
        posEvent: {
          create: { type: EPosEventType.Sale, posId },
        },
      } as Prisma.PosEventSaleCreateInput,
    });

    await Promise.all(
      movements.map(async ({ type, method, amount }) => {
        const baseData = { amount, method };
        const eventRef = { posEventSale: { connect: { id: posEventSale.id } } };
        const saleRef = { sale: { connect: { id: sale.id } } };

        const createData =
          type === ESaleMovementType.Change
            ? { type, changes: { create: baseData } }
            : { type, payments: { create: baseData } };

        await Promise.all([
          prisma.posEventSaleMovement.create({
            data: { ...eventRef, ...createData },
          }),
          prisma.saleMovement.create({ data: { ...saleRef, ...createData } }),
        ]);
      })
    );

    await Promise.all(
      mappedProducts.map(async ({ stockId, stockLotId, totalQty }) => {
        await prisma.stock.update({
          where: { id: stockId },
          data: {
            availableQty: { decrement: totalQty },
            totalQty: { decrement: totalQty },
            lots: {
              update: {
                where: { id: stockLotId },
                data: { totalQty: { decrement: totalQty } },
              },
            },
          },
        });

        await prisma.stockEvent.create({
          data: {
            type: EStockEventType.Output,
            tenantId,
            stockId,
            stockLotId,
            output: {
              create: {
                quantity: totalQty,
                description: `Adeus, estoque! 🛒 Saíram ${totalQty} unidades do lote. Venda feita, espaço liberado — bora repor?`,
              },
            },
          },
        });
      })
    );

    const tenantOwner = await prisma.tenantMembership.findFirst({
      where: { tenantId, membership: { role: EMembershipRole.Owner } },
      select: { membership: { select: { userId: true } } },
    });

    if (tenantOwner) {
      const userTenantSettings = await prisma.userTenantSettings.findUnique({
        where: {
          userId_tenantId: {
            tenantId,
            userId: tenantOwner.membership.userId,
          },
        },
      });

      if (userTenantSettings?.doNotDisturb) {
        await prisma.notification.create({
          data: {
            subject: `Venda feita para ${customer.name}! 💰`,
            body: `A loja ${tenant.name} vendeu ${CurrencyFormatter.format(
              total
            )} às ${moment(sale.createdAt).format("HH:mm")} do dia ${moment(
              sale.createdAt
            ).format("DD/MM/YYYY")}. Bora conferir os detalhes?`,
            href: PATHS.PROTECTED.DASHBOARD.SALES.SALE(sale.id).INDEX,
            targets: {
              createMany: {
                data: [{ tenantId, userId: tenantOwner.membership.userId }],
                skipDuplicates: true,
              },
            },
          },
        });

        revalidateTag(
          CACHE_TAGS.USER_TENANT(tenantOwner.membership.userId, tenantId)
            .NOTIFICATIONS
        );
        revalidateTag(CACHE_TAGS.TENANT(tenantId).SALES.INDEX.GENERAL);
      }
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

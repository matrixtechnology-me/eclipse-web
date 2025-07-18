"use server";

import { CACHE_TAGS } from "@/config/cache-tags";
import { PATHS } from "@/config/paths";
import { failure, Action, success } from "@/lib/action";
import {
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError,
} from "@/errors";
import prisma from "@/lib/prisma";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import {
  EMembershipRole,
  EPaymentMethod,
  EPosEventType,
  ESaleMovementType,
  Prisma,
} from "@prisma/client";
import moment from "moment";
import { revalidateTag } from "next/cache";
import { StockService } from "@/domain/services/stock/stock-service";
import { InvalidParamError } from "@/errors/domain/invalid-param.error";
import { InvalidEntityError } from "@/errors/domain/invalid-entity.error";
import { InsufficientUnitsError } from "@/errors/domain/insufficient-units.error";

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

      // TODO: insert within transaction.
      const mappedProducts = await Promise.all(
        products.map(async ({ id, totalQty }) => {
          const product = await prisma.product.findUnique({
            where: { id, active: true, deletedAt: null },
            include: {
              parentCompositions: {
                select: {
                  totalQty: true,
                  child: { select: { id: true } },
                },
              },
            },
          });

          if (!product) throw new NotFoundError("product not found");

          return {
            productId: product.id,
            name: product.name,
            description: product.description,
            salePrice: product.salePrice,
            totalQty,
            compositions: product.parentCompositions,
          };
        })
      );

      const estimatedTotal = mappedProducts.reduce(
        (sum, { salePrice, totalQty }) => sum + salePrice.toNumber() * totalQty,
        0
      );

      const paidTotal = movements
        .filter((mv) => mv.type === ESaleMovementType.Payment)
        .reduce((sum, mv) => sum + mv.amount, 0);

      // TODO: insert within transaction.
      const sale = await prisma.sale.create({
        data: {
          customerId,
          internalCode: Math.floor(Math.random() * 0xffffff)
            .toString(16)
            .padStart(6, "0"),
          tenantId,
          estimatedTotal,
          paidTotal,
          products: {
            createMany: {
              data: mappedProducts.map(
                ({ compositions, ...rest }) => rest
              ),
            },
          },
        },
      });

      // TODO: insert within transaction.
      const posEventSale = await prisma.posEventSale.create({
        data: {
          amount: paidTotal,
          description,
          customer: { connect: { id: customerId } },
          sale: { connect: { id: sale.id } },
          products: {
            createMany: {
              data: mappedProducts.map(
                ({ compositions, ...rest }) => rest
              ),
            },
          },
          posEvent: {
            create: { type: EPosEventType.Sale, posId },
          },
        } as Prisma.PosEventSaleCreateInput,
      });

      // TODO: insert within transaction.
      await Promise.all(
        movements.map(async ({ type, method, amount }) => {
          const baseData = { amount, method };

          const eventRef = {
            posEventSale: { connect: { id: posEventSale.id } },
          };

          const saleRef = { sale: { connect: { id: sale.id } } };

          const createData =
            type === ESaleMovementType.Change
              ? { type, change: { create: baseData } }
              : { type, payment: { create: baseData } };

          await Promise.all([
            prisma.posEventSaleMovement.create({
              data: { ...eventRef, ...createData },
            }),
            prisma.saleMovement.create({ data: { ...saleRef, ...createData } }),
          ]);
        })
      );

      // TODO: insert within transaction.
      for (const product of mappedProducts) {
        // * Decrement composition Childs Stock.
        for (const composition of product.compositions) {
          const decreaseQty =
            composition.totalQty.toNumber() * product.totalQty;

          const stockResult =
            await StockService.decrease(composition.child.id, decreaseQty);

          if (stockResult.isFailure) throw stockResult.error;

          // Revalidate child stock tags.
          const stockId = stockResult.data.stockId;
          const stockTag = CACHE_TAGS.TENANT(tenantId).STOCKS.STOCK(stockId);

          revalidateTag(stockTag.INDEX);
          revalidateTag(stockTag.LOTS);
          revalidateTag(stockTag.EVENTS);
        }

        // * Decrement Product Stock.
        const stockResult =
          await StockService.decrease(product.productId, product.totalQty);

        if (stockResult.isFailure) throw stockResult.error;

        // Revalidate parent stock tags.
        const stockId = stockResult.data.stockId;
        const stockTag = CACHE_TAGS.TENANT(tenantId).STOCKS.STOCK(stockId);

        revalidateTag(stockTag.INDEX);
        revalidateTag(stockTag.LOTS);
        revalidateTag(stockTag.EVENTS);
        revalidateTag(CACHE_TAGS.TENANT(tenantId).STOCKS.INDEX.ALL);
      }

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

        // TODO: insert within transaction.
        if (!userTenantSettings?.doNotDisturb) {
          await prisma.notification.create({
            data: {
              subject: `Venda feita para ${customer.name}! 💰`,
              body: `A loja ${tenant.name} vendeu ${CurrencyFormatter.format(
                paidTotal
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
          revalidateTag(CACHE_TAGS.TENANT(tenantId).SALES.INDEX.ALL);
        }
      }

      revalidateTag(CACHE_TAGS.TENANT(tenantId).POS.POS(posId).INDEX);

      return success({});
    } catch (error) {
      console.error(`CreatePosSale: ${JSON.stringify(error)}`);

      if (error instanceof Error) {
        const message = error.message;

        switch (error.constructor) {
          case InvalidParamError:
            return failure(new UnprocessableEntityError(message));
          case InvalidEntityError:
            return failure(new UnprocessableEntityError(message));
          case InsufficientUnitsError:
            return failure(new UnprocessableEntityError(message));
        }
      }

      return failure(
        new InternalServerError(
          "cannot create a new pos sale event because error: " + error
        )
      );
    }
  };

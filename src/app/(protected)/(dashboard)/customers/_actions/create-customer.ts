"use server";

import prisma from "@/lib/prisma";
import { Action, success, failure } from "@/lib/action";
import { reportError } from "@/utils/report-error.util";
import { ConflictError } from "@/errors/http/conflict.error";
import { BadRequestError } from "@/errors/http/bad-request.error";
import { InternalServerError } from "@/errors";
import { revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/cache-tags";

type CreateCustomerActionPayload = {
  name: string;
  phoneNumber: string;
  tenantId: string;
};

export const createCustomer: Action<
  CreateCustomerActionPayload,
  void
> = async ({ name, phoneNumber, tenantId }) => {
  try {
    if (!name || !phoneNumber) {
      throw new BadRequestError("Name and phone number are required");
    }

    const existingCustomer = await prisma.customer.findFirst({
      where: {
        phoneNumber,
        tenantId,
      },
      select: { id: true },
    });

    if (existingCustomer) {
      throw new ConflictError("Customer with this phone number already exists");
    }

    await prisma.customer.create({
      data: {
        name,
        phoneNumber,
        tenantId,
      },
    });

    revalidateTag(CACHE_TAGS.TENANT(tenantId).CUSTOMERS.INDEX.GENERAL);

    return success(undefined);
  } catch (error: unknown) {
    console.error("Failed to create customer:", error);
    return failure(
      new InternalServerError("Ocorreu um erro durante o registro", {
        originalError: error instanceof Error ? error.message : String(error),
      })
    );
  }
};

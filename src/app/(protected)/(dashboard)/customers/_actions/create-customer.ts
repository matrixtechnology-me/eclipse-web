"use server";

import prisma from "@/lib/prisma";
import { ServerAction, success, failure } from "@/core/server-actions";
import { reportError } from "@/utils/report-error.util";
import { ConflictError } from "@/errors/http/conflict.error";
import { BadRequestError } from "@/errors/http/bad-request.error";

type CreateCustomerActionPayload = {
  name: string;
  phoneNumber: string;
  tenantId: string;
};

export const createCustomer: ServerAction<
  CreateCustomerActionPayload,
  void
> = async ({ name, phoneNumber, tenantId }) => {
  try {
    // Input validation
    if (!name || !phoneNumber) {
      throw new BadRequestError("Name and phone number are required");
    }

    // Check for existing customer
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

    // Create customer
    await prisma.customer.create({
      data: {
        name,
        phoneNumber,
        tenantId,
      },
    });

    return success(undefined);
  } catch (error: unknown) {
    console.error("Failed to create customer:", error);

    // Handle known error types
    if (error instanceof BadRequestError || error instanceof ConflictError) {
      return failure(error);
    }

    // Report unexpected errors
    return reportError(error);
  }
};

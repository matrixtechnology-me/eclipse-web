"use server";

import prisma from "@/lib/prisma";
import { ServerAction } from "@/core/either";
import { propagateError } from "@/utils/propagate-error.util";

type CreateBillActionPayload = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
};

type CreateBillActionResult = {};

export const createBill: ServerAction<
  CreateBillActionPayload,
  CreateBillActionResult
> = async ({ firstName, lastName, phoneNumber }) => {
  try {
    /* await prisma.bill.create({
      data: {
        firstName,
        lastName,
        phoneNumber,
        status: "active",
      },
    }); */

    return { data: {} };
  } catch (error) {
    return propagateError(error as Error);
  }
};

"use server";

import { failure, ServerAction, success } from "@/core/server-actions";
import { InternalServerError } from "@/errors";

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

    return success({});
  } catch (error) {
    return failure(new InternalServerError());
  }
};

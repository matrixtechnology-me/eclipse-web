"use server";

import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";

type CreateExpenseActionPayload = {
  name: string;
  description: string;
  amount: number;
};

type CreateExpenseActionResult = {};

export const createExpense: ServerAction<
  CreateExpenseActionPayload,
  CreateExpenseActionResult
> = async ({ name, amount, description }) => {
  try {
    await prisma.expense.create({
      data: {
        name,
        amount,
        description,
      },
    });

    return { data: {} };
  } catch (error) {
    return propagateError(error as Error);
  }
};

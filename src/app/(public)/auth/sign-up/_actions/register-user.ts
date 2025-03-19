"use server";

import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";

type RegisterUserActionPayload = {
  name: string;
  email: string;
  password: string;
};

type RegisterUserActionResult = {
  sessionId: string;
};

export const registerUserAction: ServerAction<
  RegisterUserActionPayload,
  RegisterUserActionResult
> = async ({ email, name, password }) => {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
        role: "common",
      },
    });

    return { data: { sessionId: user.id } };
  } catch (error) {
    console.log(error);
    return propagateError(error as Error);
  }
};

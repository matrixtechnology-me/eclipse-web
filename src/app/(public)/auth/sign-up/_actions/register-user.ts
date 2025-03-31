"use server";

import { InvalidEmailError } from "@/errors/invalid-email";
import { NotFoundError } from "@/errors/not-found";
import { WeakPasswordError } from "@/errors/weak-password";
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
    if (!email.includes("@") || !email.includes(".")) {
      throw new InvalidEmailError();
    }

    if (password.length < 8) {
      throw new WeakPasswordError();
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
        role: "common",
      },
    });

    if (!user) throw new NotFoundError();

    return { data: { sessionId: user.id } };
  } catch (error) {
    const expectedErrors = [InvalidEmailError, WeakPasswordError];
    return propagateError(error as Error);
  }
};

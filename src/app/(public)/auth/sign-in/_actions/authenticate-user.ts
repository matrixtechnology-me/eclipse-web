"use server";

import { InvalidCredentialsError } from "@/errors";
import { NotFoundError } from "@/errors/not-found";
import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { propagateError } from "@/utils/propagate-error";
import { reportError } from "@/utils/report-error";

type AuthenticateUserActionPayload = {
  email: string;
  password: string;
};

type AuthenticateUserActionResult = {
  sessionId: string;
};

export const authenticateUserAction: ServerAction<
  AuthenticateUserActionPayload,
  AuthenticateUserActionResult
> = async ({ email, password }) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) throw new NotFoundError("user not found");

    if (user.password !== password)
      throw new InvalidCredentialsError("passwords dont match");

    return { data: { sessionId: user.id } };
  } catch (error: unknown) {
    if (
      error instanceof NotFoundError ||
      error instanceof InvalidCredentialsError
    ) {
      return propagateError(error);
    }
    return reportError(error);
  }
};

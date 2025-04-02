"use server";

import { InvalidCredentialsError, NotFoundError } from "@/errors";
import prisma from "@/lib/prisma";
import { HashingService } from "@/services/hashing.service";
import { ServerAction, success, failure } from "@/core/server-actions";
import { reportError } from "@/utils/report-error.util";

type AuthenticateUserActionPayload = {
  email: string;
  password: string;
};

export const authenticateUserAction: ServerAction<
  AuthenticateUserActionPayload,
  { sessionId: string }
> = async ({ email, password }) => {
  try {
    if (!email || !password) {
      return failure(
        new InvalidCredentialsError("Email and password are required")
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        active: true,
      },
    });

    if (!user) {
      return failure(new NotFoundError("User not found"));
    }

    if (!user.active) {
      return failure(new InvalidCredentialsError("Account is inactive"));
    }

    const hashingService = new HashingService();

    const passwordMatch = await hashingService.comparePassword(
      password,
      user.password
    );

    if (!passwordMatch) {
      return failure(new InvalidCredentialsError("Invalid credentials"));
    }

    return success({ sessionId: user.id });
  } catch (error: unknown) {
    console.error(`Authentication failed for ${email}:`, error);
    return reportError(error);
  }
};

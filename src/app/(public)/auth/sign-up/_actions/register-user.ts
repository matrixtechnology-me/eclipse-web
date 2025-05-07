"use server";

import { HashingService } from "@/services/hashing.service";
import prisma from "@/lib/prisma";
import { failure, ServerAction, success } from "@/core/server-actions";
import { ConflictError, InternalServerError } from "@/errors";

type RegisterUserActionPayload = {
  name: string;
  email: string;
  password: string;
};

type RegisterUserActionResult = { sessionId: string };

export const registerUserAction: ServerAction<
  RegisterUserActionPayload,
  RegisterUserActionResult
> = async ({ email, name, password }) => {
  try {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return failure(new ConflictError("invalid email address"));
    }

    if (password.length < 8) {
      return failure(
        new ConflictError("password must be at least 8 characters long")
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return failure(new ConflictError("email is already in use"));
    }

    const hashedPassword = await new HashingService().hashPassword(password);
    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword, role: "common" },
    });

    return success({ sessionId: user.id });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return failure(new InternalServerError("unable to register a new user"));
  }
};

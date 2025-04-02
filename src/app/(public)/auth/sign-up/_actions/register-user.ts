"use server";

import { HashingService } from "@/services/hashing.service";
import prisma from "@/lib/prisma";
import {
  createActionError,
  failure,
  ServerAction,
  success,
} from "@/core/server-actions";

export const registerUserAction: ServerAction<
  {
    name: string;
    email: string;
    password: string;
  },
  { sessionId: string }
> = async ({ email, name, password }) => {
  try {
    // Validate inputs
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return failure(
        createActionError(
          400,
          "InvalidEmailError",
          "Por favor, insira um email válido"
        )
      );
    }

    if (password.length < 8) {
      return failure(
        createActionError(
          400,
          "WeakPasswordError",
          "A senha deve ter pelo menos 8 caracteres"
        )
      );
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return failure(
        createActionError(409, "ConflictError", "Email já está em uso")
      );
    }

    const hashedPassword = await new HashingService().hashPassword(password);
    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword, role: "common" },
    });

    return success({ sessionId: user.id });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return failure(
      createActionError(
        500,
        "RegistrationError",
        "Ocorreu um erro durante o registro",
        {
          originalError: error instanceof Error ? error.message : String(error),
        }
      )
    );
  }
};

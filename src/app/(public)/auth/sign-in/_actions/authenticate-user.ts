"use server";

import {
  InternalServerError,
  InvalidCredentialsError,
  NotFoundError,
} from "@/errors";
import prisma from "@/lib/prisma";
import { HashingService } from "@/services/hashing.service";
import { ServerAction, success, failure } from "@/core/server-actions";
import { JwtService } from "@/services/jwt.service";

type AuthenticateUserActionPayload = {
  email: string;
  password: string;
};

export const authenticateUserAction: ServerAction<
  AuthenticateUserActionPayload,
  { accessToken: string; refreshToken: string; userId: string }
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

    const jwtService = new JwtService(process.env.JWT_SECRET ?? "");

    const accessToken = await jwtService.sign(
      { sub: user.id, type: "access" },
      "15m"
    );
    const refreshToken = await jwtService.sign(
      { sub: user.id, type: "refresh" },
      "30d"
    );

    return success({ accessToken, refreshToken, userId: user.id });
  } catch (error: unknown) {
    console.error(error);
    return failure(new InternalServerError("unable to authenticate user"));
  }
};

import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

type RequestBody = {
  type: string;
  subject: string;
  body: string;
};

export const POST = async (request: NextRequest) => {
  const { body, subject, type } = (await request.json()) as RequestBody;

  await prisma.notification.create({
    data: {
      body,
      read: false,
      subject,
      type,
    },
  });

  revalidateTag("notifications");

  return Response.json({ message: "ok" });
};

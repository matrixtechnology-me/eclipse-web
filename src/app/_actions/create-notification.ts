"use server";

import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
type CreateNotificationPayload = {
  type: string;
  subject: string;
  body: string;
};

export const createNotification = async ({
  type,
  subject,
  body,
}: CreateNotificationPayload) => {
  await prisma.notification.create({
    data: {
      type,
      subject,
      body,
      read: false,
    },
  });

  revalidateTag("notifications");

  return { data: {} };
};

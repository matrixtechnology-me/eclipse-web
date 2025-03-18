"use cache";

import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { cache } from "react";

type GetNotificationsPayload = {
  userId: string;
};

type GetNotificationsResult = {
  notifications: {
    id: string;
    type: string;
    subject: string;
    body: string;
    read: boolean;
    created_at: Date;
    updated_at: Date;
  }[];
};

export const getNotifications: ServerAction<
  GetNotificationsPayload,
  GetNotificationsResult
> = async () => {
  const cached_notifications = cache(async () => {
    cacheTag("notifications");
    const notifications = await prisma.notification.findMany();
    return notifications;
  });

  const notifications = await cached_notifications();

  return { data: { notifications } };
};

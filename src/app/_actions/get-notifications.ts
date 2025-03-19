import prisma from "@/lib/prisma";
import { ServerAction } from "@/types/server-actions";

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
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export const getNotifications: ServerAction<
  GetNotificationsPayload,
  GetNotificationsResult
> = async () => {
  const notifications = await prisma.notification.findMany();
  return { data: { notifications } };
};

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon } from "lucide-react";
import { Notification } from "./notification";
import { DoNotDisturb } from "./do-not-disturb";
import { getNotificationsAction } from "../../../_actions/get-notifications";
import { FC } from "react";

type NotificationsProps = {
  userId: string;
  tenantId: string;
};

export const Notifications: FC<NotificationsProps> = async ({
  tenantId,
  userId,
}) => {
  const result = await getNotificationsAction({
    tenantId,
    userId,
  });

  if (result.isFailure) return <div>Erro ao buscar as notificações</div>;

  const { notifications } = result.value;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="relative rounded-full">
          <div className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-primary border flex items-center justify-center">
            <span className="text-xs text-primary-foreground">
              {notifications.length}
            </span>
          </div>
          <BellIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-screen max-w-96 mr-5 p-0">
        {/* Header */}
        <div className="w-full h-12 bg-secondary border-b px-5 flex items-center justify-between">
          <h1>Notificações</h1>
          <DoNotDisturb />
        </div>
        {/* Content */}
        <div className="w-full h-96 flex flex-col">
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              body={notification.body}
              subject={notification.subject}
              type={notification.type}
              href={notification.href}
            />
          ))}
        </div>
        {/* Footer */}
        <div className="w-full h-12 bg-secondary border-t px-5 flex items-center justify-between">
          <button className="cursor-pointer">
            <span className="text-sm">Marcar todas como lidas</span>
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

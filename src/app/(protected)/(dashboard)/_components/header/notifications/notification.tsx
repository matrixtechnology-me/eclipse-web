"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ENotificationType } from "@prisma/client";
import {
  InfoIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  XCircleIcon,
  BellIcon,
  MailIcon,
  ClockIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

type NotificationProps = {
  subject: string;
  body: string;
  type: ENotificationType;
  href: string;
};

const iconMap: Record<ENotificationType, React.ElementType> = {
  [ENotificationType.Info]: InfoIcon,
  [ENotificationType.Success]: CheckCircleIcon,
  [ENotificationType.Warning]: AlertTriangleIcon,
  [ENotificationType.Error]: XCircleIcon,
  [ENotificationType.System]: BellIcon,
  [ENotificationType.Message]: MailIcon,
  [ENotificationType.Reminder]: ClockIcon,
  [ENotificationType.Alert]: AlertTriangleIcon,
};

export const Notification = ({
  subject,
  body,
  type,
  href,
}: NotificationProps) => {
  const router = useRouter();
  const Icon = iconMap[type];

  return (
    <button
      className="w-full h-16 flex items-center justify-start gap-3 px-5 border-b"
      onClick={() => {
        router.push(href);
      }}
    >
      <div className="relative size-9 rounded-full border bg-secondary flex items-center justify-center">
        <Icon className="size-4" />
        <span className="absolute -bottom-0 -right-0 flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50 opacity-75"></span>
          <span className="relative inline-flex size-2.5 rounded-full bg-primary"></span>
        </span>
      </div>
      <div className="flex-1 flex flex-col items-start">
        <span className="text-sm font-medium line-clamp-1">{subject}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {body}
              </p>
            </TooltipTrigger>
            <TooltipContent className="border bg-secondary text-secondary-foreground">
              <p>{body}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </button>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/shadcn";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FC, HTMLAttributes } from "react";

type ItemProps = {
  label: string;
  icon: LucideIcon;
  path: string;
  isCollapsed: boolean;
} & HTMLAttributes<HTMLButtonElement>;

export const Item: FC<ItemProps> = ({
  icon: Icon,
  label,
  path,
  className,
  isCollapsed,
  ...rest
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const regex = new RegExp(`^${path}(\/|$)`);

  return (
    <Button
      variant="ghost"
      size={isCollapsed ? "icon" : "default"}
      className={cn(
        "rounded-sm",
        isCollapsed ? "size-9" : "w-full h-9 flex flex-1 justify-between gap-2",
        regex.test(pathname) && "bg-secondary/25",
        className
      )}
      onClick={() => {
        router.push(path);
      }}
      {...rest}
    >
      <div className="flex items-center gap-3">
        <Icon className="size-4" />
        {!isCollapsed && <span>{label}</span>}
      </div>
    </Button>
  );
};

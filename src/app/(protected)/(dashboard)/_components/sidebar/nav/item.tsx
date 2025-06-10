"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/shadcn";
import { ChevronDownIcon, ChevronRightIcon, LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FC, HTMLAttributes, useState } from "react";

type ItemProps = {
  label: string;
  icon: LucideIcon;
  path?: string;
  isCollapsed: boolean;
  level?: number;
  items?: any[];
} & HTMLAttributes<HTMLButtonElement>;

export const Item: FC<ItemProps> = ({
  icon: Icon,
  label,
  path,
  className,
  isCollapsed,
  level = 0,
  items: subItems,
  ...rest
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = subItems && subItems.length > 0;
  const isActive = path ? new RegExp(`^${path}(\/|$)`).test(pathname) : false;

  const handleMainClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (path) {
      router.push(path);
    }
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col">
      <div className="relative flex">
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          className={cn(
            "rounded-sm flex items-center",
            isCollapsed ? "size-9" : "w-full h-9 justify-between gap-2",
            isActive && "bg-secondary/25",
            level > 0 && !isCollapsed && "pl-8",
            className,
            hasSubItems && !isCollapsed && "pr-8"
          )}
          onClick={handleMainClick}
          {...rest}
        >
          <div className="flex items-center gap-3">
            <Icon className="size-4" />
            {!isCollapsed && <span>{label}</span>}
          </div>
        </Button>

        {hasSubItems && !isCollapsed && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-secondary/25"
            onClick={handleArrowClick}
          >
            {isOpen ? (
              <ChevronDownIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            )}
          </button>
        )}
      </div>

      {hasSubItems && isOpen && !isCollapsed && (
        <div className="flex flex-col">
          {subItems?.map((subItem) => (
            <Item
              key={subItem.path || subItem.label}
              icon={subItem.icon}
              label={subItem.label}
              path={subItem.path}
              isCollapsed={isCollapsed}
              level={level + 1}
              items={subItem.items}
            />
          ))}
        </div>
      )}
    </div>
  );
};

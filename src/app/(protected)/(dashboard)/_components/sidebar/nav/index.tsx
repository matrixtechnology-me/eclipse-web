"use client";

import { PATHS } from "@/config/paths";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/shadcn";
import {
  BlocksIcon,
  BoxIcon,
  CircleGaugeIcon,
  DollarSignIcon,
  ShoppingBasketIcon,
  UsersIcon,
  type LucideIcon,
  TagIcon,
  TagsIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";

type NavProps = {
  isCollapsed: boolean;
};

type NavItem = {
  icon: LucideIcon;
  label: string;
  path?: string;
  items?: NavItem[];
};

const NAV_ITEMS: NavItem[] = [
  {
    icon: CircleGaugeIcon,
    label: "Painel de Controle",
    path: PATHS.PROTECTED.DASHBOARD.HOMEPAGE,
  },
  {
    icon: UsersIcon,
    label: "Clientes",
    path: PATHS.PROTECTED.DASHBOARD.CUSTOMERS.INDEX(),
  },
  {
    icon: BoxIcon,
    label: "Produtos",
    path: PATHS.PROTECTED.DASHBOARD.PRODUCTS.INDEX(),
  },
  {
    icon: BlocksIcon,
    label: "Estoques",
    path: PATHS.PROTECTED.DASHBOARD.STOCKS.INDEX(),
  },
  {
    icon: ShoppingBasketIcon,
    label: "PDV",
    path: PATHS.PROTECTED.DASHBOARD.POS.INDEX(),
  },
  {
    icon: DollarSignIcon,
    label: "Vendas",
    path: PATHS.PROTECTED.DASHBOARD.SALES.INDEX(),
  },
];

type ItemProps = {
  item: NavItem;
  isCollapsed: boolean;
  level?: number;
};

const Item = ({ item, isCollapsed, level = 0 }: ItemProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const hasSubItems = item.items && item.items.length > 0;
  const isActive = item.path
    ? new RegExp(`^${item.path}(\/|$)`).test(pathname)
    : false;

  const handleMainClick = () => {
    if (item.path) {
      router.push(item.path);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center px-2">
      <div className="w-full relative flex items-center justify-center">
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          className={cn(
            "rounded-sm flex items-center",
            isCollapsed ? "size-9" : "w-full h-9 justify-between gap-2",
            isActive && "bg-secondary/25",
            level > 0 && !isCollapsed && "pl-8"
          )}
          onClick={handleMainClick}
        >
          <div className="flex items-center gap-3">
            <item.icon className="size-4" />
            {!isCollapsed && <span>{item.label}</span>}
          </div>
        </Button>
      </div>

      {hasSubItems && !isCollapsed && (
        <div className="flex flex-col">
          {item.items?.map((subItem) => (
            <Item
              key={subItem.path || subItem.label}
              item={subItem}
              isCollapsed={isCollapsed}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Nav: FC<NavProps> = ({ isCollapsed }) => {
  return (
    <nav className="w-full flex-1 py-5">
      <ul className="flex flex-col gap-3 w-full">
        {NAV_ITEMS.map((item) => (
          <li
            key={item.path || item.label}
            className="w-full flex items-center justify-center"
          >
            <Item item={item} isCollapsed={isCollapsed} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

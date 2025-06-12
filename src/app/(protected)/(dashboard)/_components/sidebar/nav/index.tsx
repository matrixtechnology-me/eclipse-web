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
  ChevronDownIcon,
  ChevronRightIcon,
  type LucideIcon,
  TagIcon,
  TagsIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FC, useState } from "react";

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
    items: [
      {
        icon: TagIcon,
        label: "Categorias",
        path: PATHS.PROTECTED.DASHBOARD.PRODUCTS.CATEGORIES.INDEX(),
      },
      {
        icon: TagsIcon,
        label: "Subcategorias",
        path: PATHS.PROTECTED.DASHBOARD.PRODUCTS.SUBCATEGORIES.INDEX(),
      },
    ],
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
  const [isOpen, setIsOpen] = useState(false);
  const hasSubItems = item.items && item.items.length > 0;
  const isActive = item.path
    ? new RegExp(`^${item.path}(\/|$)`).test(pathname)
    : false;

  const handleMainClick = () => {
    if (item.path) {
      router.push(item.path);
    }
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col px-2">
      <div className="relative flex">
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          className={cn(
            "rounded-sm flex items-center",
            isCollapsed ? "size-9" : "w-full h-9 justify-between gap-2",
            isActive && "bg-secondary/25",
            level > 0 && !isCollapsed && "pl-8",
            hasSubItems && !isCollapsed && "pr-8"
          )}
          onClick={handleMainClick}
        >
          <div className="flex items-center gap-3">
            <item.icon className="size-4" />
            {!isCollapsed && <span>{item.label}</span>}
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
          <li key={item.path || item.label}>
            <Item item={item} isCollapsed={isCollapsed} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

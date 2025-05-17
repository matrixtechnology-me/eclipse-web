import { PATHS } from "@/config/paths";
import { Item } from "./item";
import {
  BlocksIcon,
  BoxIcon,
  CircleGaugeIcon,
  DollarSignIcon,
  LucideIcon,
  ShoppingBasketIcon,
  UsersIcon,
} from "lucide-react";
import { FC } from "react";

type NavProps = {
  isCollapsed: boolean;
};

type Item = {
  icon: LucideIcon;
  label: string;
  path: string;
};

const items: Item[] = [
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

export const Nav: FC<NavProps> = ({ isCollapsed }) => {
  return (
    <div className="w-full flex-1 py-5 flex flex-col items-center gap-3">
      <div className="flex flex-col gap-3">
        {items.map((it) => (
          <Item
            key={it.path}
            icon={it.icon}
            label={it.label}
            path={it.path}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </div>
  );
};

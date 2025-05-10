"use client";

import {
  BlocksIcon,
  FileChartColumnIncreasingIcon,
  ShoppingBasketIcon,
  UsersIcon,
} from "lucide-react";
import { FC } from "react";
import { Shortcut } from "./shortcut";
import { PATHS } from "@/config/paths";

type ShortcutsProps = {
  tenantId: string;
};

export const Shortcuts: FC<ShortcutsProps> = ({ tenantId }) => {
  const shortcuts = [
    {
      id: "pos",
      label: "PDV",
      icon: ShoppingBasketIcon,
      path: PATHS.PROTECTED.DASHBOARD(tenantId).POS.INDEX(),
    },
    /*   {
      id: "table",
      label: "Mesas",
      icon: HandPlatterIcon,
      path: PATHS.PROTECTED.DASHBOARD(tenantId).TABLES.INDEX,
    }, */
    /* {
      id: "delivery",
      label: "Entregas",
      icon: BikeIcon,
      path: PATHS.PROTECTED.DASHBOARD(tenantId).DELIVERIES.INDEX,
    }, */
    /*   {
      id: "bills",
      label: "Contas",
      icon: DollarSignIcon,
      path: PATHS.PROTECTED.DASHBOARD(tenantId).BILLS.INDEX,
    }, */
    {
      id: "produtos",
      label: "Produtos",
      icon: BlocksIcon,
      path: PATHS.PROTECTED.DASHBOARD(tenantId).PRODUCTS.INDEX(),
    },
    {
      id: "customers",
      label: "Clientes",
      icon: UsersIcon,
      path: PATHS.PROTECTED.DASHBOARD(tenantId).CUSTOMERS.INDEX(),
    },
    {
      id: "reports",
      label: "Relatórios",
      icon: FileChartColumnIncreasingIcon,
      path: PATHS.PROTECTED.DASHBOARD(tenantId).REPORTS.INDEX,
    },
    /*   {
      id: "adjustments",
      label: "Ajustes",
      icon: SettingsIcon,
      path: PATHS.PROTECTED.DASHBOARD(tenantId).ADJUSTMENTS.INDEX,
    }, */
  ];

  return (
    <div className="flex flex-col gap-4 md:hidden">
      <div className="flex flex-col">
        <h1 className="font-bold">Atalhos</h1>
        <p className="text-xs text-muted-foreground">
          Use os atalhos abaixo para acessar rapidamente as funcionalidades
          principais.
        </p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {shortcuts.map((shortcut) => (
          <Shortcut
            key={shortcut.id}
            icon={shortcut.icon}
            label={shortcut.label}
            path={shortcut.path}
          />
        ))}
      </div>
    </div>
  );
};

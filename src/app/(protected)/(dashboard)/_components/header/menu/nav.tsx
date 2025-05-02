import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";
import { cn } from "@/lib/shadcn";
import {
  BoxIcon,
  CircleGaugeIcon,
  DollarSignIcon,
  FileChartColumnIncreasingIcon,
  ShoppingBasketIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { FC, HTMLAttributes } from "react";

type NavProps = {
  orientation: "vertical" | "horizontal";
} & HTMLAttributes<HTMLDivElement>;

export const Nav: FC<NavProps> = ({ orientation, className, ...rest }) => {
  return (
    <div
      className={cn(
        orientation === "horizontal"
          ? "flex items-center gap-3"
          : "flex flex-col items-start gap-3",
        className
      )}
      {...rest}
    >
      <Link href={PATHS.PROTECTED.DASHBOARD.HOMEPAGE}>
        <Button variant="ghost">
          <CircleGaugeIcon className="size-4" />
          Painel de Controle
        </Button>
      </Link>
      <Link href={PATHS.PROTECTED.DASHBOARD.CUSTOMERS.INDEX()}>
        <Button variant="ghost">
          <UsersIcon className="size-4" />
          Clientes
        </Button>
      </Link>
      <Link href={PATHS.PROTECTED.DASHBOARD.PRODUCTS.INDEX()}>
        <Button variant="ghost">
          <BoxIcon className="size-4" />
          Produtos
        </Button>
      </Link>
      <Link href={PATHS.PROTECTED.DASHBOARD.STOCKS.INDEX()}>
        <Button variant="ghost">
          <BoxIcon className="size-4" />
          Estoques
        </Button>
      </Link>
      <Link href={PATHS.PROTECTED.DASHBOARD.POS.INDEX()}>
        <Button variant="ghost">
          <ShoppingBasketIcon className="size-4" />
          PDV
        </Button>
      </Link>
      <Link href={PATHS.PROTECTED.DASHBOARD.SALES.INDEX()}>
        <Button variant="ghost">
          <DollarSignIcon className="size-4" />
          Vendas
        </Button>
      </Link>
      {/* <Link href={PATHS.PROTECTED.DASHBOARD.REPORTS.INDEX}>
        <Button variant="ghost">
          <FileChartColumnIncreasingIcon className="size-4" />
          Relatórios
        </Button>
      </Link> */}
    </div>
  );
};

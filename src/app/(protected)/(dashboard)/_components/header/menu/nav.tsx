import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";
import { cn } from "@/lib/shadcn";
import {
  BoxIcon,
  CircleDollarSignIcon,
  CircleGaugeIcon,
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
      <Link href={PATHS.PROTECTED.HOMEPAGE}>
        <Button variant="ghost">
          <CircleGaugeIcon className="size-4" />
          Painel de Controle
        </Button>
      </Link>
      <Link href={PATHS.PROTECTED.CUSTOMERS.INDEX()}>
        <Button variant="ghost">
          <UsersIcon className="size-4" />
          Clientes
        </Button>
      </Link>
      <Link href={PATHS.PROTECTED.PRODUCTS.INDEX()}>
        <Button variant="ghost">
          <BoxIcon className="size-4" />
          Produtos
        </Button>
      </Link>
      <Link href={PATHS.PROTECTED.SALES.INDEX}>
        <Button variant="ghost">
          <CircleDollarSignIcon className="size-4" />
          Vendas
        </Button>
      </Link>
      {/* <Link href={PATHS.PROTECTED.PAYABLES.INDEX}>
        <Button variant="ghost">
          <ArrowUpIcon className="size-4" />
          Contas à pagar
        </Button>
      </Link>
      <Link href={PATHS.PROTECTED.RECEIVABLES.INDEX}>
        <Button variant="ghost">
          <ArrowDownIcon className="size-4" />
          Contas à receber
        </Button>
      </Link> */}
    </div>
  );
};

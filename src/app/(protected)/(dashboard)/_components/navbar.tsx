import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";
import {
  BoxIcon,
  CircleDollarSignIcon,
  CircleGaugeIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";

export const NavBar = () => {
  return (
    <div className="w-full h-16 flex items-center justify-center md:hidden">
      <Link href={PATHS.PROTECTED.HOMEPAGE} className="flex-1 h-full">
        <Button className="flex flex-col items-center bg-transparent text-foreground size-full rounded-none border-none">
          <CircleGaugeIcon className="size-4" />
          Início
        </Button>
      </Link>
      <Link href={PATHS.PROTECTED.CUSTOMERS.INDEX()} className="flex-1 h-full">
        <Button className="flex flex-col items-center bg-transparent text-foreground size-full rounded-none border-none">
          <UsersIcon className="size-4" />
          Clientes
        </Button>
      </Link>
      <Link href={PATHS.PROTECTED.PRODUCTS.INDEX()} className="flex-1 h-full">
        <Button className="flex flex-col items-center bg-transparent text-foreground size-full rounded-none border-none">
          <BoxIcon className="size-4" />
          Produtos
        </Button>
      </Link>
      <Link href={PATHS.PROTECTED.SALES.INDEX} className="flex-1 h-full">
        <Button className="flex flex-col items-center bg-transparent text-foreground size-full rounded-none border-none">
          <CircleDollarSignIcon className="size-4" />
          Vendas
        </Button>
      </Link>
    </div>
  );
};

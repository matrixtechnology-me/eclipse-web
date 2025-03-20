import Link from "next/link";
import { SignOutButton } from "./sign-out-button";
import { PATHS } from "@/config/paths";
import { Button } from "@/components/ui/button";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CircleGaugeIcon,
  EclipseIcon,
  ReceiptIcon,
  UsersIcon,
} from "lucide-react";

export const Header = () => {
  return (
    <div className="w-screen h-16 border-b">
      <div className="w-full h-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <EclipseIcon className="size-6" />
            <span className="text-lg font-stretch-75%">E C L I P S E</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href={PATHS.PROTECTED.HOMEPAGE}>
              <Button variant="ghost">
                <CircleGaugeIcon className="size-4" />
                Painel de Controle
              </Button>
            </Link>
            <Link href={PATHS.PROTECTED.CUSTOMERS.INDEX}>
              <Button variant="ghost">
                <UsersIcon className="size-4" />
                Clientes
              </Button>
            </Link>
            <Link href={PATHS.PROTECTED.PAYABLES.INDEX}>
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
            </Link>
          </div>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
};

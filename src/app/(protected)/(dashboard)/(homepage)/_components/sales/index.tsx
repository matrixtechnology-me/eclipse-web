import { FC } from "react";
import { PlusIcon, ShoppingCartIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { PATHS } from "@/config/paths";
import { Button } from "@/components/ui/button";
import { getSalesAction } from "../../_actions/get-sales";
import { Table } from "./table";

type SalesProps = {
  tenantId: string;
};

export const Sales: FC<SalesProps> = async ({ tenantId }) => {
  const result = await getSalesAction({ tenantId });

  if (result.isFailure) {
    return <div>Não foi possível carregar as vendas</div>;
  }

  const { sales } = result.value;

  return (
    <div className="h-full bg-secondary/25 rounded-sm p-5 border flex flex-col">
      <div className="h-12 flex items-center gap-3">
        <div className="size-9 bg-secondary rounded-sm flex items-center justify-center">
          <ShoppingCartIcon className="size-4" />
        </div>
        <div>
          <h1>Últimas vendas</h1>
          <p className="text-muted-foreground text-xs">
            Lista das vendas mais recentes registradas no sistema
          </p>
        </div>
      </div>
      <Separator className="my-3" />
      {sales.length ? (
        <Table data={sales} tenantId={tenantId} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
          <p className="text-sm text-muted-foreground max-w-md">
            Nenhuma venda registrada até o momento. Que tal registrar a
            primeira?
          </p>

          <Link href={PATHS.PROTECTED.DASHBOARD.SALES.INDEX()}>
            <Button className="gap-2" variant="outline">
              <PlusIcon className="size-4" />
              Registrar nova venda
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

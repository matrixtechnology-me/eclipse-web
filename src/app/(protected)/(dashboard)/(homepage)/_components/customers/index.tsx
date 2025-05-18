import { FC } from "react";
import { getCustomersAction } from "../../_actions/get-customers";
import { PlusIcon, UsersIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { List } from "./list";
import Link from "next/link";
import { PATHS } from "@/config/paths";
import { Button } from "@/components/ui/button";

type CustomerProps = {
  tenantId: string;
};

export const Customers: FC<CustomerProps> = async ({ tenantId }) => {
  const result = await getCustomersAction({ tenantId });

  if (result.isFailure) {
    return <div>Não foi possível renderizar os clientes</div>;
  }

  const { customers } = result.value;

  const maxTotalSpent = Math.max(...customers.map((c) => c.totalSpent));

  return (
    <div className="h-full bg-secondary/25 rounded-sm p-5 border flex flex-col">
      <div className="h-12 flex items-center gap-3">
        <div className="size-9 bg-secondary rounded-sm flex items-center justify-center">
          <UsersIcon className="size-4" />
        </div>
        <div>
          <h1>Clientes</h1>
          <p className="text-muted-foreground text-xs">
            Maior valor em compras processadas
          </p>
        </div>
      </div>
      <Separator className="my-3" />
      {customers.length ? (
        <List data={customers} maxTotalSpent={maxTotalSpent} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center">
          <p className="text-sm text-muted-foreground max-w-md">
            Parece que você ainda não tem clientes cadastrados. Vamos começar?
            Cadastre seu primeiro cliente para gerenciar suas vendas.
          </p>

          <Link href={PATHS.PROTECTED.DASHBOARD.CUSTOMERS.INDEX()}>
            <Button className="gap-2" variant="outline">
              <PlusIcon className="size-4" />
              Cadastrar primeiro cliente
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

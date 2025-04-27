import Link from "next/link";
import { getCustomers } from "../../_actions/get-customers";
import { Customer } from "./customer";
import { getServerSession } from "@/lib/session";
import { PlusIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";

type CustomersProps = {
  page: number;
  pageSize: number;
  query: string;
};

export const Customers = async ({
  page = 1,
  pageSize = 5,
  query,
}: CustomersProps) => {
  const session = await getServerSession({ requirements: { tenant: true } });

  if (!session) throw new Error("session not found");

  const result = await getCustomers({
    page,
    pageSize,
    tenantId: session.tenantId,
    query,
  });

  if (result.isFailure) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 border-dashed rounded-lg p-8 text-center">
        <UsersIcon className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium">Nenhum cliente cadastrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            Cadastre seu primeiro cliente para começar
          </p>
        </div>
        <Link
          href={PATHS.PROTECTED.DASHBOARD.CUSTOMERS.CREATE}
          className="w-full lg:w-fit"
        >
          <Button variant="outline" className="mt-2">
            <PlusIcon className="size-4 mr-2" />
            Adicionar cliente
          </Button>
        </Link>
      </div>
    );
  }

  const { customers } = result.value;

  return (
    <div className="grid lg:grid-cols-4 gap-5 grid-cols-1 overflow-y-auto">
      {customers.map((customer) => (
        <Link
          href={`/customers/${customer.id}`}
          key={customer.id}
          className="h-fit"
        >
          <Customer data={customer} />
        </Link>
      ))}
    </div>
  );
};

import Link from "next/link";
import { getCustomers } from "../../_actions/get-customers";
import { getServerSession } from "@/lib/session";
import { PlusIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";
import { CustomersTable } from "./table";
import { List } from "./list";
import { CreateCustomer } from "../create.customer";

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
      <div className="flex-1 flex flex-col items-center justify-center gap-3 border-dashed rounded-sm p-8 text-center">
        <UsersIcon className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium">Nenhum cliente cadastrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            Cadastre seu primeiro cliente para começar
          </p>
        </div>
        <CreateCustomer />
      </div>
    );
  }

  const { customers } = result.value;

  return (
    <>
      <List data={customers} tenandId={session.tenantId} />
      <CustomersTable
        data={customers}
        pagination={{ initialPage: page, initialPageSize: pageSize }}
        tenantId={session.tenantId}
      />
    </>
  );
};

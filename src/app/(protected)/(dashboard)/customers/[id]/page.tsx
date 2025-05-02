import { NextPage } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PATHS } from "@/config/paths";
import { getCustomer } from "./_actions/get-customer";
import { DeleteCustomer } from "./_components/delete-customer";
import { Name } from "./_components/name";
import { getServerSession } from "@/lib/session";
import { PhoneNumber } from "./_components/phone-number";
import { Active } from "./_components/active";

type PageParams = {
  id: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { id } = await params;

  const session = await getServerSession({ requirements: { tenant: true } });

  if (!session) throw new Error("session not found");

  const result = await getCustomer({
    customerId: id,
    tenantId: session.tenantId,
  });

  if (result.isFailure) {
    return <div>Nenhum cliente encontrado</div>;
  }

  const { customer } = result.value;

  const properties = [
    { label: "Nome", value: customer.name, copyable: true },
    {
      label: "Número de telefone",
      value: customer.phoneNumber,
      copyable: true,
    },
    {
      label: "Status",
      value: customer.active ? "Ativo" : "Inativo",
      copyable: false,
    },
  ];

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1>Clientes</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.DASHBOARD.HOMEPAGE}>
                  Painel de controle
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={PATHS.PROTECTED.DASHBOARD.CUSTOMERS.INDEX()}
                >
                  Clientes
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{customer.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <DeleteCustomer customerId={customer.id} tenantId={session.tenantId} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Name
          customerId={customer.id}
          tenantId={session.tenantId}
          defaultValue={customer.name}
        />
        <PhoneNumber
          customerId={customer.id}
          tenantId={session.tenantId}
          defaultValue={customer.phoneNumber}
        />
        <Active
          customerId={customer.id}
          tenantId={session.tenantId}
          defaultValue={customer.active}
        />
      </div>
    </div>
  );
};

export default Page;

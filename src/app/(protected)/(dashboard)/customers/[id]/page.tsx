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
import { getCustomer } from "../_actions/get-customer";
import { Property } from "@/components/property";
import { DeleteCustomer } from "./_components/delete-customer";

type PageParams = {
  id: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { id } = await params;

  const result = await getCustomer({
    id,
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
        <DeleteCustomer id={customer.id} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {properties.map((property) => (
          <Property
            key={property.label}
            label={property.label}
            value={property.value}
            copyable={property.copyable}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;

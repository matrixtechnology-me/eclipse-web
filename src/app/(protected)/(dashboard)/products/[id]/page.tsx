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
import { getProduct } from "../_actions/get-product";
import { Property } from "@/components/property";
import { DeleteCustomer } from "./_components/delete-customer";
import { SpecificationsTable } from "./_components/specifications-table";
import { Stock } from "./_components/stock";
import { Lots } from "./_components/lots";

type PageParams = {
  id: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { id } = await params;

  const result = await getProduct({
    id,
  });

  if (result.isFailure) {
    return <div>Nenhum produto encontrado</div>;
  }

  const { product } = result.value;

  const properties = [
    { label: "Nome", value: product.name, copyable: true },
    {
      label: "Descrição",
      value: product.description ?? "",
      copyable: true,
    },
    {
      label: "Status",
      value: product.active ? "Ativo" : "Inativo",
      copyable: false,
    },
  ];

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1>Produtos</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.HOMEPAGE}>
                  Painel de controle
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.PRODUCTS.INDEX()}>
                  Produtos
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="flex flex-col gap-5">
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
        {/* Specifications */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <h1 className="font-bold">Especificações</h1>
            <p className="text-sm text-muted-foreground max-w-md">
              Detalhes essenciais do produto, como dimensões, material e outras
              características relevantes.
            </p>
          </div>
          <SpecificationsTable data={product.specifications} />
        </div>
        <Stock
          id={product.stock.id}
          lots={product.stock.lots}
          availableQty={product.stock.availableQty}
          strategy={product.stock.strategy}
          totalQty={product.stock.totalQty}
        />
        <Lots data={product.stock.lots} stockId={product.stock.id} />
      </div>
    </div>
  );
};

export default Page;

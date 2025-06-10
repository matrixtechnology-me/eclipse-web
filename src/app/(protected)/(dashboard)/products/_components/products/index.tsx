import { getServerSession } from "@/lib/session";
import { PackageIcon } from "lucide-react";
import { FC } from "react";
import { getProductsAction } from "../../_actions/get-products";
import { CreateProduct } from "../create-product";
import { List } from "./list";
import { Table } from "./table";

type ProductsProps = {
  page: number;
  pageSize: number;
  query: string;
};

export const Products: FC<ProductsProps> = async ({
  page,
  pageSize,
  query,
}) => {
  const session = await getServerSession({ requirements: { tenant: true } });

  if (!session) throw new Error("Session not found");

  const result = await getProductsAction({
    tenantId: session.tenantId,
    page,
    pageSize,
    query,
  });

  if ("error" in result) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 border-dashed rounded-sm p-8 text-center">
        <PackageIcon className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium">Nenhum produto cadastrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            Cadastre seu primeiro produto para começar
          </p>
        </div>
        <CreateProduct tenantId={session.id} />
      </div>
    );
  }

  const { products } = result.value;

  return (
    <>
      <List data={products} tenantId={session.tenantId} />
      <Table
        data={products}
        pagination={{ initialPage: page, initialPageSize: pageSize }}
        tenantId={session.tenantId}
      />
    </>
  );
};

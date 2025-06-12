import { getServerSession } from "@/lib/session";
import { PackageIcon } from "lucide-react";
import { FC } from "react";
import { getSubcategoriesAction } from "../../_actions/get-subcategories";
import { AddCategory } from "../add-subcategory";
import { List } from "./list";
import { Table } from "./table";

type CategoriesProps = {
  page: number;
  pageSize: number;
  query: string;
};

export const Categories: FC<CategoriesProps> = async ({
  page,
  pageSize,
  query,
}) => {
  const session = await getServerSession({ requirements: { tenant: true } });

  if (!session) throw new Error("Session not found");

  const result = await getSubcategoriesAction({
    tenantId: session.tenantId,
    page,
    pageSize,
    query,
  });

  if (result.isFailure) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 border-dashed rounded-sm p-8 text-center">
        <PackageIcon className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium">Nenhuma categoria cadastrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            Cadastre seu primeira categoria para começar
          </p>
        </div>
        <AddCategory tenantId={session.id} />
      </div>
    );
  }

  const { subcategories } = result.value;

  return (
    <>
      <List data={subcategories} tenantId={session.tenantId} />
      <Table
        data={subcategories}
        pagination={{ initialPage: page, initialPageSize: pageSize }}
        tenantId={session.tenantId}
      />
    </>
  );
};

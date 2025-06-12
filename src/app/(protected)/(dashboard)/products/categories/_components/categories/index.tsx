import { getServerSession } from "@/lib/session";
import { PackageIcon } from "lucide-react";
import { FC } from "react";
import { getCategoriesAction } from "../../_actions/get-categories";
import { AddCategory } from "../add-category";
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

  const result = await getCategoriesAction({
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
        <AddCategory tenantId={session.tenantId} />
      </div>
    );
  }

  const { categories } = result.value;

  return (
    <>
      <List data={categories} tenantId={session.tenantId} />
      <Table
        data={categories}
        pagination={{ initialPage: page, initialPageSize: pageSize }}
        tenantId={session.tenantId}
      />
    </>
  );
};

import { getServerSession } from "@/lib/session";
import { Table } from "./table";
import { List } from "./list";
import { FC } from "react";
import { getSalesAction } from "../../_actions/get-sales";

type SalesProps = {
  page: number;
  pageSize: number;
  query: string;
};

export const Sales: FC<SalesProps> = async ({ page, pageSize, query }) => {
  const session = await getServerSession({
    requirements: { tenant: true },
  });

  if (!session) throw new Error("session not found");

  const result = await getSalesAction({
    tenantId: session.tenantId,
    page,
    pageSize,
    query,
  });

  if (result.isFailure) {
    return <div>Erro ao buscar os PDVs</div>;
  }

  const { sales } = result.value;

  return (
    <>
      <List data={sales} tenantId={session.tenantId} />
      <Table
        data={sales}
        pagination={{ initialPage: page, initialPageSize: pageSize }}
        tenantId={session.tenantId}
      />
    </>
  );
};

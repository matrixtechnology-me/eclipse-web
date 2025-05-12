import { getServerSession } from "@/lib/session";
import { Table } from "./table";
import { List } from "./list";
import { getPosAction } from "../../_actions/get-pos";
import { FC } from "react";

type PosProps = {
  page: number;
  pageSize: number;
  query: string;
};

export const Pos: FC<PosProps> = async ({ page, pageSize, query }) => {
  const session = await getServerSession({
    requirements: { tenant: true },
  });

  if (!session) throw new Error("session not found");

  const result = await getPosAction({
    tenantId: session.tenantId,
    page,
    pageSize,
    query,
  });

  if (result.isFailure) {
    return <div>Erro ao buscar os PDVs</div>;
  }

  const { pos } = result.value;

  return (
    <>
      <List data={pos} tenantId={session.tenantId} />
      <Table
        data={pos}
        pagination={{ initialPage: page, initialPageSize: pageSize }}
        tenantId={session.tenantId}
      />
    </>
  );
};

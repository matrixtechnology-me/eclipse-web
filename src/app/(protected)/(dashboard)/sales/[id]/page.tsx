import { NextPage } from "next";
import { getSaleAction } from "./_actions/get-sale";
import { getServerSession } from "@/lib/session";

type PageParams = {
  id: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { id } = await params;

  const session = await getServerSession({
    requirements: {
      tenant: true,
    },
  });

  if (!session) throw new Error("session not found");

  const result = await getSaleAction({
    saleId: id,
    tenantId: session.tenantId,
  });

  if (result.isFailure) {
    return <div>Nenhuma venda encontrada</div>;
  }

  const { sale } = result.value;

  return <div>{sale.id}</div>;
};

export default Page;

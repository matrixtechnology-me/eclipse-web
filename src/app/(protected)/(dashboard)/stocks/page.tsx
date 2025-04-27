import { NextPage } from "next";
import { getStocksAction } from "./_actions/get-stocks";
import { getServerSession } from "@/lib/session";
import Link from "next/link";
import { PATHS } from "@/config/paths";

const Page: NextPage = async () => {
  const session = await getServerSession({
    requirements: {
      tenant: true,
    },
  });

  if (!session) throw new Error("session not found");

  const result = await getStocksAction({
    tenantId: session.tenantId,
  });

  if (result.isFailure) {
    return <div>Nenhum estoque encontrado</div>;
  }

  const { stocks } = result.value;

  return (
    <div>
      {stocks.map((stock) => (
        <Link
          href={PATHS.PROTECTED.DASHBOARD.STOCKS.STOCK(stock.id).INDEX}
          key={stock.id}
        >
          {stock.product.name}
        </Link>
      ))}
    </div>
  );
};

export default Page;

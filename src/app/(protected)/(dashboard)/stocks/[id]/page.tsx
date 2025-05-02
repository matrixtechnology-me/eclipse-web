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
import { Stock } from "../../stocks/[id]/_components/stock";
import { getStockAction } from "./_actions/get-stock";
import { getServerSession } from "@/lib/session";
import { Lots } from "./_components/lots";
import { History } from "./_components/history";
import { Summary } from "../../pos/[id]/_components/summary";
import { StockSummary } from "./_components/summary";

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

  const result = await getStockAction({
    stockId: id,
    tenantId: session.tenantId,
  });

  if (result.isFailure) {
    return <div>Nenhum estoque encontrado</div>;
  }

  const { stock } = result.value;

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1>Estoques</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.DASHBOARD.HOMEPAGE}>
                  Painel de controle
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.DASHBOARD.STOCKS.INDEX()}>
                  Estoques
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{stock.product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <Stock
          id={stock.id}
          lots={stock.lots}
          availableQty={stock.availableQty}
          strategy={stock.strategy}
          totalQty={stock.totalQty}
        />
        <Lots data={stock.lots} stockId={stock.id} />
        <StockSummary stockId={stock.id} tenantId={session.tenantId} />
        <History
          stockId={stock.id}
          tenantId={session.tenantId}
          stockLots={stock.lots}
        />
      </div>
    </div>
  );
};

export default Page;

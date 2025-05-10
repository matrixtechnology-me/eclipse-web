import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PATHS } from "@/config/paths";
import { getServerSession } from "@/lib/session";
import { NextPage } from "next";
import { Stock } from "./_components/stock";
import { getStockAction } from "./_actions/get-stock";
import { History } from "./_components/history";
import { Lots } from "./_components/lots";
import { StockSummary } from "./_components/summary";
import { Separator } from "@/components/ui/separator";

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
                <BreadcrumbLink
                  href={PATHS.PROTECTED.DASHBOARD(session.tenantId).HOMEPAGE}
                >
                  Painel de controle
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={PATHS.PROTECTED.DASHBOARD(
                    session.tenantId
                  ).STOCKS.INDEX()}
                >
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
          availableQty={stock.availableQty}
          strategy={stock.strategy}
          totalQty={stock.totalQty}
          tenantId={session.tenantId}
        />
        <Separator className="my-5" />
        <StockSummary stockId={stock.id} tenantId={session.tenantId} />
        <History
          stockId={stock.id}
          tenantId={session.tenantId}
          stockLots={stock.lots}
        />
        <Separator className="my-5" />
        <Lots data={stock.lots} stockId={stock.id} />
      </div>
    </div>
  );
};

export default Page;

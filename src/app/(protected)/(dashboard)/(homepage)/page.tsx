import { NextPage } from "next";
import { getCustomersCount } from "./_actions/get-customers-count";
import { getServerSession } from "@/lib/session";
import { getProductsCount } from "./_actions/get-products-count";
import { getInvoicing } from "./_actions/get-invoicing";
import { getAverageTicket } from "./_actions/get-average-ticket";
import { CustomersCounter } from "./_components/customers-counter";
import { ProductsCounter } from "./_components/products-counter";
import { AverageTicket } from "./_components/average-ticket";
import { Invoicing } from "./_components/invoicing";
import { Retrospective } from "./_components/retrospective";
import { Customers } from "./_components/customers";
import { Sales } from "./_components/sales";
import { Categories } from "./_components/categories";

const Page: NextPage = async () => {
  const session = await getServerSession({ requirements: { tenant: true } });

  if (!session) throw new Error("session not found");

  const results = {
    customersCount: await getCustomersCount({
      tenantId: session.tenantId,
    }),
    productsCount: await getProductsCount({
      tenantId: session.tenantId,
    }),
    invoicing: await getInvoicing({
      tenantId: session.tenantId,
    }),
    averageTicket: await getAverageTicket({
      tenantId: session.tenantId,
    }),
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="grid grid-cols-8 gap-5">
        <div className="flex flex-col gap-5 col-span-6">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
            <CustomersCounter result={results.customersCount} />
            <ProductsCounter result={results.productsCount} />
            <AverageTicket result={results.averageTicket} />
            <Invoicing result={results.invoicing} />
          </div>
          <Retrospective tenantId={session.tenantId} />
        </div>
        <div className="col-span-2">
          <Customers tenantId={session.tenantId} />
        </div>
      </div>
      <div className="h-[650px] grid grid-cols-8 gap-5">
        <div className="col-span-2">
          <Categories tenantId={session.tenantId} />
        </div>
        <div className="col-span-6">
          <Sales tenantId={session.tenantId} />
        </div>
      </div>
    </div>
  );
};

export default Page;

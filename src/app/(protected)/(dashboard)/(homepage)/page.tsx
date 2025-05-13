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
import { Shortcuts } from "./_components/shortcuts";
import { Alerts } from "./_components/alerts";
import { Retrospective } from "./_components/retrospective";

const Page: NextPage = async () => {
  const session = await getServerSession({ requirements: { tenant: true } });

  if (!session) return;

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
    <div className="p-5 flex flex-col gap-5">
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 ">
        <CustomersCounter result={results.customersCount} />
        <ProductsCounter result={results.productsCount} />
        <AverageTicket result={results.averageTicket} />
        <Invoicing result={results.invoicing} />
      </div>
      <Shortcuts tenantId={session.tenantId} />
      <Retrospective tenantId={session.tenantId} />
    </div>
  );
};

export default Page;

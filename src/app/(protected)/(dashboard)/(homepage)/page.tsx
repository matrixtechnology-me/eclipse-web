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

const Page: NextPage = async () => {
  const session = await getServerSession();

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
    <div className="grid grid-cols-5 gap-5 p-5">
      <CustomersCounter either={results.customersCount} />
      <ProductsCounter either={results.productsCount} />
      <AverageTicket either={results.averageTicket} />
      <Invoicing either={results.invoicing} />
    </div>
  );
};

export default Page;

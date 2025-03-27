import Link from "next/link";
import { getCustomers } from "../../_actions/get-customers";
import { Customer } from "./customer";

type CustomersProps = {
  page: number;
  pageSize: number;
};

export const Customers = async ({ page = 1, pageSize = 5 }: CustomersProps) => {
  const result = await getCustomers({
    page,
    pageSize,
  });

  if ("error" in result) {
    return <div>Nenhum cliente encontrado</div>;
  }

  const { customers } = result.data;

  return (
    <div className="grid lg:grid-cols-4 gap-5 grid-cols-1 overflow-y-auto">
      {customers.map((customer) => (
        <Link
          href={`/customers/${customer.id}`}
          key={customer.id}
          className="h-fit"
        >
          <Customer data={customer} />
        </Link>
      ))}
    </div>
  );
};

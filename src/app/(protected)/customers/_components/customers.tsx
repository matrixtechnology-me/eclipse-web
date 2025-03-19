import Link from "next/link";
import { getCustomers } from "../_actions/get-customers";

export const Customers = async () => {
  const customers = await getCustomers();

  return (
    <div>
      {customers.data.customers.map((customer) => (
        <Link href={`/customers/${customer.id}`} key={customer.id}>
          {customer.name}
        </Link>
      ))}
    </div>
  );
};

import Link from "next/link";
import { getCustomers } from "../_actions/get-customers";
import { UserIcon } from "lucide-react";

export const Customers = async () => {
  const customers = await getCustomers();

  return (
    <div className="grid grid-cols-5 gap-5">
      {customers.data.customers.map((customer) => (
        <Link href={`/customers/${customer.id}`} key={customer.id}>
          <div className="flex-1 border border-secondary p-5">
            <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
              <UserIcon className="size-4" />
            </div>
            <div>
              <h1>
                {customer.firstName} {customer.lastName}
              </h1>
              <span>{customer.phoneNumber}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

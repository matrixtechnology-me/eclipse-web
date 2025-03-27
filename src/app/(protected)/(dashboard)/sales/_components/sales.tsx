import Link from "next/link";
import { UserIcon } from "lucide-react";
import { getSales } from "../_actions/get-sales";

export const Sales = async () => {
  const result = await getSales();

  return (
    <div className="grid grid-cols-5 gap-5">
      {result.data.sales.map((sale) => (
        <Link href={`/customers/${sale.id}`} key={sale.id}>
          <div className="flex-1 border border-secondary p-5">
            <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
              <UserIcon className="size-4" />
            </div>
            <div>{sale.status}</div>
          </div>
        </Link>
      ))}
    </div>
  );
};

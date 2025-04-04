import { getSales } from "../../_actions/get-sales";
import { getServerSession } from "@/lib/session";
import { Sale } from "./sale";

export const Sales = async () => {
  const session = await getServerSession({
    requirements: { tenant: true },
  });

  if (!session) return null;

  const result = await getSales({ tenantId: session.tenantId });

  if (result.isFailure) return null;

  const { sales } = result.value;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {sales.map((sale) => (
        <Sale data={sale} key={sale.id} />
      ))}
    </div>
  );
};

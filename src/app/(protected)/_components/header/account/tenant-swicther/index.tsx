import { getUserTenants } from "@/app/(protected)/_actions/get-user-tenants";
import { getServerSession } from "@/lib/session";
import { SelectTenant } from "./select-tenant";

export const TenantSwicther = async () => {
  const session = await getServerSession();

  if (!session) throw new Error("session not found");

  const result = await getUserTenants({
    userId: session.id,
  });

  if ("error" in result) {
    return <div>Nenhuma tenant encontrada</div>;
  }

  const { tenants } = result.data;

  return <SelectTenant tenantId={session.tenantId} tenants={tenants} />;
};

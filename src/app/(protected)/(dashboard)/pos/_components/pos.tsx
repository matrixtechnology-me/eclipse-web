import { getServerSession } from "@/lib/session";
import { getPosAction } from "../_actions/get-pos";
import Link from "next/link";
import { PATHS } from "@/config/paths";

export const Pos = async () => {
  const session = await getServerSession({
    requirements: { tenant: true },
  });

  if (!session) throw new Error("session not found");

  const result = await getPosAction({
    tenantId: session.tenantId,
  });

  if (result.isFailure) {
    return <div>Erro ao buscar os PDVs</div>;
  }

  const { pos } = result.value;

  return (
    <div>
      {pos.map((pos) => (
        <Link
          key={pos.id}
          href={PATHS.PROTECTED.DASHBOARD.POS.POS(pos.id).INDEX}
        >
          {pos.name}
        </Link>
      ))}
    </div>
  );
};

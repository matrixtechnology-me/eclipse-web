import { FC } from "react";
import { AddEntry } from "./_components/add-entry";
import { AddOutput } from "./_components/add-output";
import { AddSale } from "./_components/add-sale";
import { History } from "./_components/history";
import { Summary } from "./_components/summary";
import { UpdateStatus } from "./_components/update-status";
import { getServerSession } from "@/lib/session";
import { getPosAction } from "./_actions/get-pos";

type PageParams = {
  id: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const Page: FC<PageProps> = async ({ params }) => {
  const { id } = await params;

  const session = await getServerSession({
    requirements: {
      tenant: true,
    },
  });

  if (!session) throw new Error("session not found");

  const result = await getPosAction({
    posId: id,
    tenantId: session.tenantId,
  });

  if (result.isFailure) {
    return <div>Nenhum PDV encontrado</div>;
  }

  const { pos } = result.value;

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AddEntry
            posId={id}
            posStatus={pos.status}
            tenantId={session.tenantId}
          />
          <AddOutput
            posId={id}
            posStatus={pos.status}
            tenantId={session.tenantId}
          />
          <AddSale
            posId={id}
            posStatus={pos.status}
            tenantId={session.tenantId}
          />
        </div>
        <div className="flex items-center">
          <UpdateStatus
            posId={pos.id}
            tenantId={session.tenantId}
            value={pos.status}
          />
        </div>
      </div>
      <Summary posId={id} tenantId={session.tenantId} />
      <History posId={id} />
    </div>
  );
};

export default Page;

import { FC } from "react";
import { AddEntry } from "./_components/add-entry";
import { AddOutput } from "./_components/add-output";
import { AddSale } from "./_components/add-sale";
import { History } from "./_components/history";
import { Summary } from "./_components/summary";
import { UpdateStatus } from "./_components/update-status";
import { getServerSession } from "@/lib/session";
import { getPosAction } from "./_actions/get-pos";
import { DeletePos } from "./_components/delete-pos";
import { AddPayment } from "./_components/add-payment";

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

  const commonProps = {
    posId: pos.id,
    tenantId: session.tenantId,
  };

  return (
    <div className="flex flex-col gap-8 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AddEntry posStatus={pos.status} {...commonProps} />
          <AddOutput posStatus={pos.status} {...commonProps} />
          <AddSale posStatus={pos.status} {...commonProps} />
          <AddPayment posStatus={pos.status} {...commonProps} />
        </div>
        <div className="flex items-end gap-3">
          <UpdateStatus value={pos.status} {...commonProps} />
          <DeletePos {...commonProps} />
        </div>
      </div>
      <Summary {...commonProps} />
      <History {...commonProps} />
    </div>
  );
};

export default Page;

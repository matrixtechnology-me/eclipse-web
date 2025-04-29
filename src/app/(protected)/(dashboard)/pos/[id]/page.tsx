import { FC } from "react";
import { AddEntry } from "./_components/add-entry";
import { AddOutput } from "./_components/add-output";
import { AddSale } from "./_components/add-sale";
import { History } from "./_components/history";
import { Summary } from "./_components/summary";

type PageParams = {
  id: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const Page: FC<PageProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center gap-3">
        <AddEntry posId={id} />
        <AddOutput posId={id} />
        <AddSale posId={id} />
      </div>
      <Summary posId={id} />
      <History posId={id} />
    </div>
  );
};

export default Page;

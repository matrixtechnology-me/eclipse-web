import { FC } from "react";
import { AddEntry } from "./_components/add-entry";
import { AddOutput } from "./_components/add-output";
import { AddPayment } from "./_components/add-payment";
import { AddSale } from "./_components/add-sale";
import { History } from "./_components/history";

type PageParams = {
  id: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const Page: FC<PageProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <div>
      <AddEntry posId={id} />
      <AddOutput posId={id} />
      <AddSale posId={id} />
      <History posId={id} />
    </div>
  );
};

export default Page;

import { NextPage } from "next";
import { getSaleAction } from "./_actions/get-sale";
import { getServerSession } from "@/lib/session";
import { PhoneNumberFormatter } from "@/utils/formatters/phone-number";
import { Items } from "./_components/items";
import { Movements } from "./_components/movements";
import { Customer } from "./_components/customer";

type PageParams = {
  id: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { id } = await params;

  const session = await getServerSession({
    requirements: {
      tenant: true,
    },
  });

  if (!session) throw new Error("session not found");

  const result = await getSaleAction({
    saleId: id,
    tenantId: session.tenantId,
  });

  if (result.isFailure) {
    return <div>Nenhuma venda encontrada</div>;
  }

  const { sale } = result.value;

  return (
    <div className="p-5 flex flex-col gap-5">
      <Customer
        name={sale.customer.name}
        phoneNumber={sale.customer.phoneNumber}
      />
      <Items data={sale.products} />
      <Movements data={sale.movements} />
    </div>
  );
};

export default Page;

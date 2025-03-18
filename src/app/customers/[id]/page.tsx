import { NextPage } from "next";
import { getCustomer } from "../_actions/get-customer";
import { DeleteCustomer } from "./_components/delete-customer";

type PageParams = {
  id: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { id } = await params;

  const result = await getCustomer({ id });

  const { customer } = result.data;

  if (!customer) return <div>Cliente não encontrado</div>;

  return (
    <div>
      {customer?.name}
      <DeleteCustomer id={customer.id} />
    </div>
  );
};

export default Page;

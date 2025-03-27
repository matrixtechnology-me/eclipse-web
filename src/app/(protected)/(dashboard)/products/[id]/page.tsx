import { NextPage } from "next";
import { DeleteCustomer } from "./_components/delete-customer";
import { Customer } from "./_components/customer";
import { Suspense } from "react";

type PageParams = {
  id: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { id } = await params;

  return (
    <div>
      <Suspense fallback={<div>Carregando...</div>}>
        <DeleteCustomer id={id} />
        <Customer id={id} />
      </Suspense>
    </div>
  );
};

export default Page;

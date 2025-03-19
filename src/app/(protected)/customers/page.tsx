import Link from "next/link";
import { Customers } from "./_components/customers";
import { Suspense } from "react";

const Page = () => {
  return (
    <div className="">
      <Link href="/customers/create">
        <button>Novo cliente</button>
      </Link>
      <Suspense>
        <Customers />
      </Suspense>
    </div>
  );
};

export default Page;

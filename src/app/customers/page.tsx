import Link from "next/link";
import { Customers } from "./_components/customers";

const Page = () => {
  return (
    <div className="">
      <Link href="/customers/create">
        <button>Novo cliente</button>
      </Link>
      <Customers />
    </div>
  );
};

export default Page;

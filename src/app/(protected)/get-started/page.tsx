import { NextPage } from "next";
import { CreateTenantForm } from "./_components/create-tenant-form";

const Page: NextPage = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <CreateTenantForm />
    </div>
  );
};

export default Page;

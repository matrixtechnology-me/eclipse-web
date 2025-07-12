import { NextPage } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Search } from "./_components/search";
import { Suspense } from "react";
import { Pos } from "./_components/pos";
import { CreatePos } from "./_components/create-pos";
import { getServerSession } from "@/lib/session";

type PageSearchParams = {
  page?: string;
  limit?: string;
  query?: string;
};

type PageProps = {
  searchParams: Promise<PageSearchParams>;
};

const Page: NextPage<PageProps> = async ({ searchParams }) => {
  const { page = 1, limit = 5, query = "" } = await searchParams;

  const session = await getServerSession({ requirements: { tenant: true } });

  if (!session) throw new Error("session not found");

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-full flex-1">
      <div className="flex flex-col gap-5 p-5 h-[calc(100%-64px)]">
        <div className="w-full">
          <h1>PDVs</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Painel de controle</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>PDVs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex flex-col gap-3">
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3">
            <Search query={query} tenantId={session.tenantId} />
            <CreatePos />
          </div>
          <Suspense fallback={<div>Carregando...</div>}>
            <Pos page={Number(page)} pageSize={Number(limit)} query={query} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Page;

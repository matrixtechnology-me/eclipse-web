import Link from "next/link";
import { Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { PATHS } from "@/config/paths";
import { Sales } from "./_components/sales";
import { NextPage } from "next";
import { Search } from "./_components/search";
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
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 p-4 md:p-6">
      <div className="w-full">
        <h1>Vendas</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Painel de controle</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Vendas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3">
        <Search query={query} tenantId={session.tenantId} />
      </div>
      <Suspense fallback={<div>Carregando...</div>}>
        <Sales page={Number(page)} pageSize={Number(limit)} query={query} />
      </Suspense>
    </div>
  );
};

export default Page;

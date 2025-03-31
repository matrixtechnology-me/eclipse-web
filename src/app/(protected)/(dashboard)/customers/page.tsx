import Link from "next/link";
import { Customers } from "./_components/customers";
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
import { Pagination } from "@/app/(protected)/(dashboard)/customers/_components/pagination";
import { NextPage } from "next";
import { Search } from "./_components/search";
import { PATHS } from "@/config/paths";

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

  return (
    <div className="flex flex-col h-full flex-1">
      <div className="flex flex-col gap-5 p-5 h-[calc(100%-64px)]">
        <div className="w-full flex flex-col items-center justify-between gap-3">
          <div className="w-full">
            <h1>Clientes</h1>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Painel de controle</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Clientes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3">
            <Search query={query} />
            <Link
              href={PATHS.PROTECTED.CUSTOMERS.CREATE}
              className="w-full lg:w-fit"
            >
              <Button variant="outline" className="w-full lg:w-fit">
                <PlusIcon />
                <span>Adicionar cliente</span>
              </Button>
            </Link>
          </div>
        </div>
        <Suspense fallback={<div>Carregando...</div>}>
          <Customers
            page={Number(page)}
            pageSize={Number(limit)}
            query={query}
          />
        </Suspense>
      </div>
      <Pagination initialPage={Number(page)} initialPageSize={Number(limit)} />
    </div>
  );
};

export default Page;

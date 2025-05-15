import Link from "next/link";
import { Products } from "./_components/products";
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
import { PlusIcon, Package } from "lucide-react";
import { PATHS } from "@/config/paths";
import { Skeleton } from "@/components/ui/skeleton";
import { NextPage } from "next";
import { Search } from "./_components/search";
import { CreateProduct } from "./_components/create-product";
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
    <div className="flex flex-col gap-5 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Package className="size-6 text-primary sm:hidden" />
          <div>
            <h1 className="text-xl font-semibold">Produtos</h1>
            <Breadcrumb className="text-sm">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Painel de Controle</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Produtos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>
      <div className="rounded-lg flex flex-col gap-5">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3">
          <Search query={query} tenantId={session.tenantId} />
          <CreateProduct tenantId={session.tenantId} />
        </div>
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          }
        >
          <Products
            page={Number(page)}
            pageSize={Number(limit)}
            query={query}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;

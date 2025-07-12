import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { getServerSession } from "@/lib/session";
import { Package } from "lucide-react";
import { NextPage } from "next";
import { Suspense } from "react";
import { CreateProduct } from "./_components/create-product";
import { Products } from "./_components/products";
import { Search } from "./_components/search";

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
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-5 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Package className="size-6 text-primary sm:hidden" />
          <div>
            <h1>Produtos</h1>
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
      <div className="rounded-sm flex flex-col gap-5">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3">
          <Search query={query} tenantId={session.tenantId} />
          <div className="flex items-center gap-3">
            <CreateProduct tenantId={session.tenantId} />
          </div>
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

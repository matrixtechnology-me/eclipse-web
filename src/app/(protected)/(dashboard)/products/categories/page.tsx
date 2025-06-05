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
import { AddCategory } from "./_components/add-category";
import { Categories } from "./_components/categories";
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

  const session = await getServerSession({ requirements: { tenant: true } });

  if (!session) throw new Error("session not found");

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Package className="size-6 text-primary sm:hidden" />
          <div>
            <h1 className="text-xl font-semibold">Categorias</h1>
            <Breadcrumb className="text-sm">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={PATHS.PROTECTED.DASHBOARD.HOMEPAGE}>
                    Painel de Controle
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href={PATHS.PROTECTED.DASHBOARD.PRODUCTS.INDEX()}
                  >
                    Produtos
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Categorias</BreadcrumbPage>
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
            <AddCategory tenantId={session.tenantId} />
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
          <Categories
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

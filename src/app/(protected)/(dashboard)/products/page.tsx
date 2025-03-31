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

const Page = () => {
  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Package className="size-6 text-primary sm:hidden" />
          <div>
            <h1 className="text-xl font-semibold">Produtos</h1>
            <Breadcrumb className="text-sm">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Produtos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <Link
          href={PATHS.PROTECTED.PRODUCTS.CREATE}
          className="w-full sm:w-auto"
        >
          <Button className="w-full sm:w-auto gap-1">
            <PlusIcon className="size-4" />
            <span>Novo produto</span>
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border p-1 sm:p-3">
        <Suspense
          fallback={
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          }
        >
          <Products />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;

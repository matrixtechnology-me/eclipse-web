import Link from "next/link";
import { Sales } from "./_components/sales";
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
import { PlusIcon, ShoppingCart } from "lucide-react";
import { PATHS } from "@/config/paths";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const Page = () => {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShoppingCart className="size-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Vendas</h1>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href={PATHS.PROTECTED.HOMEPAGE}>
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Vendas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <Link href={PATHS.PROTECTED.SALES.CREATE} className="w-full md:w-auto">
          <Button variant="outline" className="w-full md:w-auto gap-2">
            <PlusIcon className="size-4" />
            <span>Nova Venda</span>
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        }
      >
        <Sales />
      </Suspense>
    </div>
  );
};

export default Page;

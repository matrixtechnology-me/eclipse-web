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
import { PlusIcon } from "lucide-react";
import { PATHS } from "@/config/paths";

const Page = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
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
        <Link href={PATHS.PROTECTED.SALES.CREATE}>
          <Button>
            <PlusIcon />
            <span>Novo venda</span>
          </Button>
        </Link>
      </div>
      <Suspense>
        <Sales />
      </Suspense>
    </div>
  );
};

export default Page;

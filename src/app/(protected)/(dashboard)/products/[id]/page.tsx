import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PATHS } from "@/config/paths";
import { getServerSession } from "@/lib/session";
import { NextPage } from "next";
import { getProduct } from "../_actions/get-product";
import { Active } from "./_components/active/active";
import { Description } from "./_components/description";
import { Name } from "./_components/name";
import { SalePrice } from "./_components/sale-price";
import { Specifications } from "./_components/specifications";
import { DeleteProduct } from "./_components/delete-product";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Category } from "./_components/category";
import { FileUploader } from "./_components/attachments/file-uploader";
import { Attachments } from "./_components/attachments";
import { Compositions } from "./_components/compositions";

type PageParams = {
  id: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { id } = await params;

  const session = await getServerSession({
    requirements: {
      tenant: true,
    },
  });

  if (!session) throw new Error("session not found");

  const result = await getProduct({
    id,
  });

  if (result.isFailure) {
    return <div>Nenhum produto encontrado</div>;
  }

  const { product } = result.value;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-5 p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1>Produtos</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.DASHBOARD.HOMEPAGE}>
                  Painel de controle
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
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link
            href={
              PATHS.PROTECTED.DASHBOARD.STOCKS.STOCK(product.stock.id).INDEX
            }
          >
            <Button variant="outline">Ir para o estoque</Button>
          </Link>
          <DeleteProduct productId={product.id} tenantId={session.tenantId} />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Name
            defaultValue={product.name}
            productId={product.id}
            tenantId={session.tenantId}
          />
          <Category
            defaultValue={product.categoryId}
            productId={product.id}
            tenantId={session.tenantId}
          />
          <Description
            defaultValue={product.description}
            productId={product.id}
            tenantId={session.tenantId}
          />
          <Active
            defaultValue={product.active}
            productId={product.id}
            tenantId={session.tenantId}
          />
          <SalePrice
            defaultValue={product.salePrice}
            productId={product.id}
            tenantId={session.tenantId}
          />
        </div>
        <Attachments productId={product.id} attachments={product.attachments} />
        <Specifications productId={product.id} tenantId={session.tenantId} />
        <Compositions productId={product.id} tenantId={session.tenantId} />
      </div>
    </div>
  );
};

export default Page;

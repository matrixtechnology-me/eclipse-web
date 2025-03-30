import { NextPage } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PATHS } from "@/config/paths";
import { getProduct } from "../../../_actions/get-product";
import { getProductVariation } from "./_actions/get-product-variation";
import { SpecificationsTable } from "./_components/specifications-table";
import { Lots } from "./_components/lots";
import { Stock } from "./_components/stock";

type PageParams = {
  id: string;
  "sku-code": string;
};

type PageProps = {
  params: Promise<PageParams>;
};

const Page: NextPage<PageProps> = async ({ params }) => {
  const { id, "sku-code": skuCode } = await params;

  const results = {
    product: await getProduct({
      id,
    }),
    productVariation: await getProductVariation({
      skuCode: skuCode,
    }),
  };

  if ("error" in results.product) {
    return <div>Nenhum produto encontrado</div>;
  }

  const { product } = results.product.data;

  if ("error" in results.productVariation) {
    return <div>Nenhuma variação do produto encontrada</div>;
  }

  const { productVariation } = results.productVariation.data;

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Produtos</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.HOMEPAGE}>
                  Painel de controle
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={PATHS.PROTECTED.PRODUCTS.INDEX()}>
                  Produtos
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbLink
                href={PATHS.PROTECTED.PRODUCTS.PRODUCT(product.id).INDEX}
              >
                {product.name}
              </BreadcrumbLink>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Variações</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {productVariation.skuCode.toUpperCase()}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      {/* Content */}
      <div className="flex flex-col gap-5">
        {/* Specifications */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col">
            <h1 className="font-bold">Especificações</h1>
            <p className="text-sm text-muted-foreground max-w-md">
              Detalhes essenciais do produto, como dimensões, material e outras
              características relevantes.
            </p>
          </div>
          <SpecificationsTable data={productVariation.specifications} />
        </div>
        <Stock
          id={productVariation.stock.id}
          lots={productVariation.stock.lots}
          availableQty={productVariation.stock.availableQty}
          strategy={productVariation.stock.strategy}
          totalQty={productVariation.stock.totalQty}
        />
        <Lots
          data={productVariation.stock.lots}
          stockId={productVariation.stock.id}
        />
      </div>
    </div>
  );
};

export default Page;

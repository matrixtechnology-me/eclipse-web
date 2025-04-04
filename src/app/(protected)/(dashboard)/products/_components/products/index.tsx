import Link from "next/link";
import { getProducts } from "../../_actions/get-products";
import { PATHS } from "@/config/paths";
import { Product } from "./product";
import { PackageIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/session";

export const Products = async () => {
  const session = await getServerSession({ requirements: { tenant: true } });

  if (!session) throw new Error("Session not found");

  const result = await getProducts({
    tenantId: session.tenantId,
  });

  if ("error" in result) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 border-dashed rounded-lg p-8 text-center">
        <PackageIcon className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium">Nenhum produto cadastrado</p>
          <p className="text-sm text-muted-foreground mt-1">
            Cadastre seu primeiro produto para começar
          </p>
        </div>
        <Link
          href={PATHS.PROTECTED.PRODUCTS.CREATE}
          className="w-full lg:w-fit"
        >
          <Button variant="outline" className="mt-2">
            <PlusIcon className="size-4 mr-2" />
            Adicionar produto
          </Button>
        </Link>
      </div>
    );
  }

  const { products } = result.value;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {products.map((product) => (
        <Link
          href={PATHS.PROTECTED.PRODUCTS.PRODUCT(product.id).INDEX}
          key={product.id}
          className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg transition-all"
          aria-label={`Ver detalhes do produto ${product.name}`}
        >
          <Product
            data={product}
            className="group-hover:shadow-md group-hover:border-primary transition-all"
          />
        </Link>
      ))}
    </div>
  );
};

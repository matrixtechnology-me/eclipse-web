import Link from "next/link";
import { getProducts } from "../_actions/get-products";
import { UserIcon } from "lucide-react";

export const Products = async () => {
  const result = await getProducts();

  return (
    <div className="grid grid-cols-5 gap-5">
      {result.data.products.map((product) => (
        <Link href={`/products/${product.id}`} key={product.id}>
          <div className="flex-1 border border-secondary p-5">
            <div className="size-9 rounded-lg bg-secondary flex items-center justify-center">
              <UserIcon className="size-4" />
            </div>
            <div>
              <h1>{product.name}</h1>
              <span>{product.amount}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ProductsTable } from "./components/products-summary-table";
import { AddProduct } from "./components/add-product";
import { CreateSaleSchema } from "../../_utils/validations/create-sale";

interface ProductsProps {
  form: UseFormReturn<CreateSaleSchema>;
}

export const Products = ({ form }: ProductsProps) => {
  const productsFieldArray = useFieldArray<CreateSaleSchema, "products">({
    name: "products",
    control: form.control,
  });

  return (
    <div className="w-full flex flex-col mt-2 pt-4">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-[15px]">Produtos</h2>
        <AddProduct appendProduct={productsFieldArray.append} />
      </div>
      <ProductsTable productsFieldArray={productsFieldArray} />
      {form.formState.errors.products && (
        <span className="mt-2 text-sm font-medium text-destructive">
          {form.formState.errors.products.message}
        </span>
      )}
    </div>
  );
};

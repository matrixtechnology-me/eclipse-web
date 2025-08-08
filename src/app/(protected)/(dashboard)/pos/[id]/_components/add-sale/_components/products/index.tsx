import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ProductsTable } from "./components/products-summary-table";
import { AddProduct, AddProductSchema } from "./components/add-product";
import { CreateSaleSchema } from "../../_utils/validations/create-sale";

interface ProductsProps {
  form: UseFormReturn<CreateSaleSchema>;
  tenantId: string;
}

export const Products = ({ form, tenantId }: ProductsProps) => {
  const productsFieldArray = useFieldArray<CreateSaleSchema, "products">({
    name: "products",
    control: form.control,
  });

  const appendProduct = (formData: AddProductSchema) => {
    const existentProduct = productsFieldArray.fields
      .find(field => field.productId == formData.productId);

    if (!existentProduct) return productsFieldArray.append(formData);

    productsFieldArray.update(
      productsFieldArray.fields.indexOf(existentProduct),
      {
        ...existentProduct,
        quantity: existentProduct.quantity + formData.quantity,
      }
    );
  }

  const removeProduct = (productId: string) => {
    const field = productsFieldArray.fields.find(f => f.productId == productId);
    if (!field) throw new Error("No related field to product id.");

    productsFieldArray.remove(productsFieldArray.fields.indexOf(field));
  }

  return (
    <div className="w-full flex flex-col mt-2 pt-4">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-[15px]">Produtos</h2>
        <AddProduct
          appendProduct={appendProduct}
          fields={productsFieldArray.fields}
          tenantId={tenantId}
        />
      </div>
      <ProductsTable
        productFields={productsFieldArray.fields}
        removeProduct={removeProduct}
      />

      {form.formState.errors.products && (
        <span className="mt-2 text-sm font-medium text-destructive">
          {form.formState.errors.products.message}
        </span>
      )}
    </div>
  );
};

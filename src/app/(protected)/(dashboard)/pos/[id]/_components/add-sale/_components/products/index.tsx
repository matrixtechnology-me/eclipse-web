import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ProductsTable } from "./components/products-summary-table";
import { AddProduct, AddProductSchema } from "./components/add-product";
import { CreateSaleSchema } from "../../_utils/validations/create-sale";
import { UsedStock } from "../..";
import { Dispatch, SetStateAction } from "react";

interface ProductsProps {
  form: UseFormReturn<CreateSaleSchema>;
  tenantId: string;
  usedStock: {
    state: UsedStock[];
    set: Dispatch<SetStateAction<UsedStock[]>>;
  };
}

export const Products = ({ form, tenantId, usedStock }: ProductsProps) => {
  const productsFieldArray = useFieldArray<CreateSaleSchema, "products">({
    name: "products",
    control: form.control,
  });


  const appendProduct = (payload: AddProductSchema) => {
    const { productId } = payload;
    const quantity = Number(payload.quantity);

    const existent = productsFieldArray.fields
      .find(field => field.productId == productId);

    if (existent) { // Updating
      productsFieldArray.update(
        productsFieldArray.fields.indexOf(existent),
        { ...existent, quantity: existent.quantity + quantity }
      );

      usedStock.set(prev => {
        const usedStock = prev.find(item => item.productId == productId);
        if (!usedStock) throw new Error("Used stock not populated.");

        return prev.map(item => item.productId === productId
          ? { ...item, quantity: item.quantity + Number(payload.quantity) }
          : item
        );
      });

      return;
    }

    // Adding
    productsFieldArray.append(payload);
    usedStock.set(prev => [
      ...prev,
      { productId, quantity: Number(quantity) },
    ]);
  }

  const removeProduct = (productId: string) => {
    const idx = productsFieldArray.fields
      .findIndex(p => p.productId == productId);

    productsFieldArray.remove(idx);
    usedStock.set(prev => prev.filter(item => item.productId !== productId));
  }

  return (
    <div className="w-full flex flex-col mt-2 pt-4">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-[15px]">Produtos</h2>
        <AddProduct
          appendProduct={appendProduct}
          usedStock={usedStock}
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

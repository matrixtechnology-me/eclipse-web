import { useFieldArray, UseFormReturn } from "react-hook-form";
import { ReceivingMethodsTable } from "./components/receiving-methods-summary-table";
import { AddProduct } from "./components/add-receiving-method";
import { CreateSaleSchema } from "../../_utils/validations/create-sale";

interface ReceivingMethodsProps {
  form: UseFormReturn<CreateSaleSchema>;
}

export const ReceivingMethods = ({ form }: ReceivingMethodsProps) => {
  const receivingMethodsFieldArray = useFieldArray<
    CreateSaleSchema,
    "receivingMethods"
  >({
    name: "receivingMethods",
    control: form.control,
  });

  return (
    <div className="w-full flex flex-col mt-2 pt-4">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-[15px]">Formas de recebimento</h2>
        <AddProduct appendProduct={receivingMethodsFieldArray.append} />
      </div>
      <ReceivingMethodsTable
        receivingMethodsFieldArray={receivingMethodsFieldArray}
      />
      {form.formState.errors.products && (
        <span className="mt-2 text-sm font-medium text-destructive">
          {form.formState.errors.products.message}
        </span>
      )}
    </div>
  );
};

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { MovementsTable } from "./components/movements-summary-table";
import { AddMovement } from "./components/add-movement";
import { CreateSaleSchema } from "../../_utils/validations/create-sale";

interface MovementsProps {
  form: UseFormReturn<CreateSaleSchema>;
}

export const Movements = ({ form }: MovementsProps) => {
  const movementsFieldArray = useFieldArray<CreateSaleSchema, "movements">({
    name: "movements",
    control: form.control,
  });

  return (
    <div className="w-full flex flex-col mt-2 pt-4">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-[15px]">Movimentações</h2>
        <AddMovement appendMovement={movementsFieldArray.append} />
      </div>
      <MovementsTable movementsFieldArray={movementsFieldArray} />
      {form.formState.errors.products && (
        <span className="mt-2 text-sm font-medium text-destructive">
          {form.formState.errors.products.message}
        </span>
      )}
    </div>
  );
};

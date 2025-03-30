import { useFieldArray, UseFormReturn } from "react-hook-form";
import { VariationsTable } from "./components/variations-table";
import { AddVariation } from "./components/add-variation";
import { CreateProductSchema } from "../../_utils/validations/create-product";

interface VariationsProps {
  form: UseFormReturn<CreateProductSchema>;
}

export const Variations = ({ form }: VariationsProps) => {
  const variationsFieldArray = useFieldArray<CreateProductSchema, "variations">(
    {
      name: "variations",
      control: form.control,
    }
  );

  return (
    <div className="w-full flex flex-col mt-2 pt-4">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex flex-col">
          <h1>Variações</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            SKU (Stock Keeping Unit) é um código único que identifica e organiza
            produtos no estoque, facilitando o controle e a gestão.
          </p>
        </div>
        <AddVariation appendVariation={variationsFieldArray.append} />
      </div>
      <VariationsTable variationsFieldArray={variationsFieldArray} />
      {form.formState.errors.variations && (
        <span className="mt-2 text-sm font-medium text-destructive">
          {form.formState.errors.variations.message}
        </span>
      )}
    </div>
  );
};

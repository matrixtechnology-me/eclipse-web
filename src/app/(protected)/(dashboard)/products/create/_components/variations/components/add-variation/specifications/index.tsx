import { useFieldArray, UseFormReturn } from "react-hook-form";
import { AddSpecification } from "./components/add-specification";
import { CreateProductVariationSchema } from "../../../../../_utils/validations/create-product";
import { FC } from "react";
import { SpecificationsTable } from "./components/specifications-table";

type SpecificationsProps = {
  form: UseFormReturn<CreateProductVariationSchema>;
};

export const Specifications: FC<SpecificationsProps> = ({ form }) => {
  const specificationsFieldArray = useFieldArray<
    CreateProductVariationSchema,
    "specifications"
  >({
    name: "specifications",
    control: form.control,
  });

  return (
    <div className="w-full flex flex-col mt-2 pt-4">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex flex-col">
          <h1>Especificações</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">-</p>
        </div>
        <AddSpecification
          appendSpecification={specificationsFieldArray.append}
        />
      </div>
      <SpecificationsTable
        specificationsFieldArray={specificationsFieldArray}
      />
      {form.formState.errors.specifications && (
        <span className="mt-2 text-sm font-medium text-destructive">
          {form.formState.errors.specifications.message}
        </span>
      )}
    </div>
  );
};

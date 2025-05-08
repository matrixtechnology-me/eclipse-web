import { useFieldArray, UseFormReturn } from "react-hook-form";
import { AddSpecification } from "./components/add-specification";
import { FC } from "react";
import { SpecificationsTable } from "./components/specifications-table";
import { CreateProductSchema } from "../../_utils/validations/create-product";

type SpecificationsProps = {
  form: UseFormReturn<CreateProductSchema>;
};

export const Specifications: FC<SpecificationsProps> = ({ form }) => {
  const specificationsFieldArray = useFieldArray<
    CreateProductSchema,
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

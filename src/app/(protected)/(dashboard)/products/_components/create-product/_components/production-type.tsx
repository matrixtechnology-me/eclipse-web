import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductionTypePresenter } from "@/utils/presenters/production-type";
import { ProductionType } from "@prisma/client";
import { ComponentProps, FC } from "react";

export const ProductionTypeInput: FC<ComponentProps<typeof Select>> = (
  props,
) => {
  return (
    <Select {...props}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione o tipo de produção" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(ProductionType).map(item => (
          <SelectItem key={item} value={item}>
            {ProductionTypePresenter.present(item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
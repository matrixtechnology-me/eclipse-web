"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getProductsAction,
  ProductListItem,
} from "@/app/(protected)/(dashboard)/products/_actions/get-products";

type Props = Omit<React.ComponentProps<typeof Select>, "onValueChange"> & {
  page: number;
  pageSize: number;
  tenantId: string;
  onChange: (selected: ProductListItem) => void;
  query?: string;
};

export const ProductAsyncSelect: FC<Props> = ({
  page,
  pageSize,
  tenantId,
  onChange,
  query,
  ...props
}) => {
  const [values, setValues] = useState<ProductListItem[]>([]);

  useEffect(() => {
    const loadValues = async () => {
      const result = await getProductsAction({
        page,
        pageSize,
        tenantId,
        query: query || "",
      });

      if (result.isFailure) {
        return toast("", {
          description: "Erro ao buscar clientes.",
        });
      }

      const { products } = result.value;
      setValues(products);
    };

    loadValues();
  }, []);

  return (
    <Select
      {...props}
      onValueChange={(selectedId) => {
        onChange(values.find(v => v.id == selectedId)!);
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione uma opção..." />
      </SelectTrigger>
      <SelectContent>
        {values.map(({ id, name }) => (
          <SelectItem key={id} value={id}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

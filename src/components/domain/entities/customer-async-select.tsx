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
import { getCustomersAction } from "@/app/(protected)/(dashboard)/(homepage)/_actions/get-customers";

type Value = {
  id: string;
  name: string;
};

type Props = React.ComponentProps<typeof Select> & {
  tenantId: string;
};

export const CustomerAsyncSelect: FC<Props> = ({ tenantId, ...props }) => {
  const [values, setValues] = useState<Value[]>([]);

  useEffect(() => {
    const loadValues = async () => {
      // TODO: handle data pagination.
      const result = await getCustomersAction({
        tenantId,
      });

      if (result.isFailure) {
        return toast("", {
          description: "Erro ao buscar clientes.",
        });
      }

      const { customers } = result.value;
      setValues(customers);
    };

    loadValues();
  }, []);

  return (
    <Select {...props}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione uma opção..." />
      </SelectTrigger>
      <SelectContent>
        {values.map((value) => (
          <SelectItem key={value.id} value={value.id}>
            {value.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

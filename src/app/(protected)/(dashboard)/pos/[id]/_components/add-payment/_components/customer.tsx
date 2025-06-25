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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { FormSchema } from "../";
import { getCustomersAction } from "@/app/(protected)/(dashboard)/(homepage)/_actions/get-customers";

type Value = {
  id: string;
  name: string;
};

type CustomerProps = {
  tenantId: string;
};

export const Customer: FC<CustomerProps> = ({ tenantId }) => {
  const [values, setValues] = useState<Value[]>([]);

  const form = useFormContext<FormSchema>();

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
    <FormField
      control={form.control}
      name="customerId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cliente</FormLabel>
          <FormControl>
            <Select
              {...field}
              onValueChange={field.onChange}
            >
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
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

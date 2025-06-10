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
import { getCategoriesAction } from "../../../categories/_actions/get-categories";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from ".";

type Value = {
  id: string;
  name: string;
};

type CategoryProps = {
  form: UseFormReturn<FormSchema>;
  tenantId: string;
};

export const Category: FC<CategoryProps> = ({ tenantId, form }) => {
  const [values, setValues] = useState<Value[]>([]);

  useEffect(() => {
    const loadValues = async () => {
      const result = await getCategoriesAction({
        page: 1,
        pageSize: 99,
        tenantId,
        query: "",
      });

      if (result.isFailure) {
        return toast("", {
          description: "",
        });
      }

      const { categories } = result.value;

      setValues(categories);
    };

    loadValues();
  }, []);

  return (
    <FormField
      control={form.control}
      name="categoryId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Categoria</FormLabel>
          <FormControl>
            <Select
              {...field}
              onValueChange={(value) => {
                field.onChange(value);
              }}
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

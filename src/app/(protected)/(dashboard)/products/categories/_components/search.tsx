"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { PATHS } from "@/config/paths";

const searchFormSchema = z.object({
  query: z.string().optional(),
});

type SearchFormInputs = z.infer<typeof searchFormSchema>;

type SearchProps = {
  query: string;
  tenantId: string;
};

export const Search: React.FC<SearchProps> = ({ query = "", tenantId }) => {
  const router = useRouter();

  const form = useForm<SearchFormInputs>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      query,
    },
  });

  const onSubmit: SubmitHandler<SearchFormInputs> = (data) => {
    router.push(
      PATHS.PROTECTED.DASHBOARD.PRODUCTS.CATEGORIES.INDEX({
        query: data.query,
      })
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-fit flex items-end gap-2"
      >
        <FormField
          name="query"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    className="min-w-72"
                    placeholder="Insira a sua busca..."
                    {...field}
                  />
                  <Button variant="outline" size="icon" type="submit">
                    <SearchIcon className="size-4" />
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

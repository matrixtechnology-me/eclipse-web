"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
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
};

export const Search: React.FC<SearchProps> = ({ query = "" }) => {
  const router = useRouter();

  const form = useForm<SearchFormInputs>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      query,
    },
  });

  const onSubmit: SubmitHandler<SearchFormInputs> = (data) => {
    router.push(
      PATHS.PROTECTED.CUSTOMERS.INDEX({
        query: data.query,
      })
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end gap-2"
      >
        <FormField
          name="query"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="query">Pesquisar</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input placeholder="Insira a sua busca..." {...field} />
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

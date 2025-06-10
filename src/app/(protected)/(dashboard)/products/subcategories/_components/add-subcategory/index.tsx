"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createSubcategoryAction } from "../../_actions/create-subcategory";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "./category";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome da sub-categoria deve ter pelo menos 2 caracteres.",
  }),
  description: z.string().default(""),
  categoryId: z.string({
    required_error: "A sub-categoria é obrigatória.",
  }),
});

export type FormSchema = z.infer<typeof formSchema>;

export const AddCategory = ({ tenantId }: { tenantId: string }) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormSchema) => {
    console.log(values);

    const result = await createSubcategoryAction({
      name: values.name,
      description: values.description,
      tenantId,
      categoryId: values.categoryId,
    });

    if (result.isFailure) {
      return toast("Erro", {
        description: "Não foi possível criar uma nova sub-categoria",
      });
    }

    toast("Sucesso", {
      description: "Sub-categoria criada com sucesso",
    });

    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Nova sub-categoria</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova sub-categoria</DialogTitle>
          <DialogDescription>
            Adicione uma nova sub-categoria de produtos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="min-h-32" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Category form={form} tenantId={tenantId} />

            <Button type="submit">Salvar</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { PATHS } from "@/config/paths";
import { getServerSession } from "@/lib/session";
import { createProduct } from "../../_actions/create-product";
import { BarcodeInput } from "./_components/barcode-input";
import { CurrencyInput } from "./_components/currency-input";
import { Specifications } from "./_components/specifications";
import {
  createProductSchema,
  CreateProductSchema,
} from "./_utils/validations/create-product";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CreateProduct = () => {
  const router = useRouter();

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      barCode: "",
      salePrice: 0,
      specifications: [],
    },
  });

  const onSubmit = async (values: CreateProductSchema) => {
    try {
      const session = await getServerSession({
        requirements: { tenant: true },
      });

      if (!session) throw new Error("Sessão não encontrada");

      const result = await createProduct({
        ...values,
        description: values.description || "",
        tenantId: session.tenantId,
      });

      if (result.isFailure) return;

      toast.success("Produto criado com sucesso");
      router.push(PATHS.PROTECTED.DASHBOARD.PRODUCTS.INDEX());
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao criar o produto"
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <PlusIcon className="size-4" />
          Novo Produto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl px-0">
        <DialogHeader className="px-5">
          <DialogTitle>Novo Produto</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para cadastrar um novo produto.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <ScrollArea className="h-full max-h-[512px] px-5">
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Produto*</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome do produto"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="barCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de Barras*</FormLabel>
                      <FormControl>
                        <BarcodeInput
                          placeholder="Digite o código de barras"
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço de Venda*</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="R$ 0,00"
                          onChange={field.onChange}
                          value={field.value}
                        />
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
                        <Textarea
                          placeholder="Descrição do produto"
                          className="min-h-48"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Specifications form={form} />
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-3 px-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Salvando alterações..."
                  : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

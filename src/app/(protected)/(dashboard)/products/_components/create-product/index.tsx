"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { FC, useState } from "react";
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

import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { getServerSession } from "@/lib/session";
import { createProduct } from "../../_actions/create-product";
import { BarcodeInput } from "./_components/barcode-input";
import { CurrencyInput } from "./_components/currency-input";
import { DatePicker } from "./_components/date-picker";
import { Specifications } from "./_components/specifications";
import {
  createProductSchema,
  CreateProductSchema,
} from "./_utils/validations/create-product";

type CreateProductProps = {
  tenantId: string;
};

export const CreateProduct: FC<CreateProductProps> = ({ tenantId }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [showStock, setShowStock] = useState<boolean>(false);

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      product: {
        name: "",
        description: "",
        barCode: "",
        salePrice: 0,
        specifications: [],
      },
      stock: {
        costPrice: 0,
        initialQuantity: 0,
      },
    },
  });

  const onSubmit = async (values: CreateProductSchema) => {
    try {
      const session = await getServerSession({
        requirements: { tenant: true },
      });

      if (!session) throw new Error("Sessão não encontrada");

      const result = await createProduct({
        ...values.product,
        ...values.stock,
        description: values.product.description || "",
        tenantId: session.tenantId,
      });

      if (result.isFailure) return;

      toast.success("Produto criado com sucesso");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao criar o produto"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 my-5"
          >
            <ScrollArea className="h-full max-h-[512px] px-5">
              <div className="space-y-5">
                <FormField
                  control={form.control}
                  name="product.name"
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
                  name="product.description"
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

                <FormField
                  control={form.control}
                  name="product.barCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de Barras*</FormLabel>
                      <FormControl>
                        <BarcodeInput
                          placeholder="Digite o código de barras"
                          onChange={field.onChange}
                          value={field.value}
                          tenantId={tenantId}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="product.salePrice"
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

                <Specifications form={form} />

                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="stock-switch"
                        checked={showStock}
                        onCheckedChange={setShowStock}
                      />
                      <Label htmlFor="stock-switch">
                        Configurar estoque inicial
                      </Label>
                    </div>
                    {!showStock && (
                      <span className="text-xs text-muted-foreground">
                        Estoque inicial desativado
                      </span>
                    )}
                  </div>

                  {showStock && (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h1 className="text-sm font-semibold tracking-tight">
                            Estoque inicial
                          </h1>
                          <p className="text-muted-foreground text-xs">
                            Defina a quantidade, custo e data de validade do
                            lote inicial.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <FormField
                          control={form.control}
                          name="stock.costPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preço de Custo*</FormLabel>
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
                          name="stock.initialQuantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantidade inicial*</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="Insira a quantidade inicial"
                                  {...field}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    field.onChange(isNaN(value) ? 0 : value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stock.expiresAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de validade (opcional)</FormLabel>
                              <FormControl>
                                <DatePicker
                                  onChange={field.onChange}
                                  value={field.value}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-3 px-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
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

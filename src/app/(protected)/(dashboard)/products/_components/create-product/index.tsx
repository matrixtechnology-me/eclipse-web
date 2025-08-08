"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { getServerSession } from "@/lib/session";
import { createProduct } from "../../_actions/create-product";
import { BarcodeInput } from "./_components/barcode-input";
import { CurrencyInput } from "./_components/currency-input";
import {
  createProductSchema,
  CreateProductSchema,
} from "./_utils/validations/create-product";
import { ProductionTypeInput } from "./_components/production-type";
import { StockInput } from "./_components/stock";
import { ProductionType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { PATHS } from "@/config/paths";

type CreateProductProps = {
  tenantId: string;
};

export const CreateProduct: FC<CreateProductProps> = ({ tenantId }) => {
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      product: {
        name: "",
        description: "",
        barCode: "",
        salePrice: 0,
        salable: true,
        productionType: undefined,
        composite: false,
      },
      stock: undefined,
    },
  });

  const onSubmit = async (formData: CreateProductSchema) => {
    try {
      const session = await getServerSession({
        requirements: { tenant: true },
      });

      if (!session) throw new Error("Sessão não encontrada");

      const result = await createProduct({
        ...formData.product,
        initialStock: formData.stock,
        description: formData.product.description || "",
        tenantId: session.tenantId,
      });

      if (result.isFailure) return;
      const productId = result.value as string;

      toast.success("Produto criado com sucesso");
      form.reset();
      setOpen(false);

      router.push(PATHS.PROTECTED.DASHBOARD.PRODUCTS.PRODUCT(productId).INDEX);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao criar o produto"
      );
    }
  };

  const [productionType, composite] = form.watch([
    "product.productionType",
    "product.composite"
  ]);

  const toggleProductionType = (input: ProductionType) => {
    if (input == "Outsourced" && composite)
      form.setValue("product.composite", false, { shouldValidate: true });

    form.setValue("product.productionType", input, { shouldValidate: true });
  }

  const toggleComposite = (toggle: boolean) => {
    if (!toggle) form.setValue("stock", undefined, { shouldValidate: true });
    form.setValue("product.composite", toggle, { shouldValidate: true });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <PlusIcon className="size-4" />
          Novo Produto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl px-5 h-[500px] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
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
                name="product.salable"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>É vendável?*</FormLabel>
                    </div>
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

              <FormField
                control={form.control}
                name="product.productionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Produção*</FormLabel>
                    <FormControl>
                      <ProductionTypeInput
                        name={field.name}
                        value={field.value}
                        onValueChange={toggleProductionType}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {productionType == "Own" && (
                <FormField
                  control={form.control}
                  name="product.composite"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={toggleComposite}
                          />
                        </FormControl>
                        <FormLabel>É composto?*</FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {!composite && <StockInput />}
            </div>

            <div className="flex justify-end gap-3">
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

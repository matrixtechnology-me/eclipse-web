import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Controller, UseFieldArrayAppend, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { PlusIcon } from "lucide-react";
import { z } from "zod";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultOptionType,
  SelectPaginated,
} from "@/components/select-paginated";
import { GroupBase } from "react-select";
import { LoadOptions } from "react-select-async-paginate";
import {
  CreateSaleSchema,
  productSchema,
} from "../../../_utils/validations/create-sale";
import { getProducts, Product } from "../../../../_actions/get-products";
import { CurrencyFormatter } from "@/utils/formatters/currency";

interface IProps {
  appendProduct: UseFieldArrayAppend<CreateSaleSchema, "products">;
}

type OrderItemFormType = z.infer<typeof productSchema>;

const formDefaultValues: OrderItemFormType = {
  id: "",
  name: "",
  costPrice: 0,
  salePrice: 0,
  quantity: "1",
  /* discount: {
    amount: "0.00",
    variant: "cash",
  }, */
};

export const AddProduct = ({ appendProduct }: IProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<OrderItemFormType>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(productSchema),
  });

  // call this function on form 'onSubmit' property causes dialogs to close
  const onSubmit = () => {
    const submissionFn = form.handleSubmit(
      (formData: OrderItemFormType) => {
        appendProduct(formData);
        setOpen(false);
        form.reset(formDefaultValues);
      },
      (errors) => console.log(errors)
    );
    submissionFn();
  };

  const loadPaginatedSearchProducts: LoadOptions<
    DefaultOptionType<Product>,
    GroupBase<DefaultOptionType<Product>>,
    { page: number; itemsPerPage: number }
  > = async (input, _prevOptions, additional) => {
    if (input.trim().length < 3 && input.trim().length > 0) {
      form.setError("id", { message: "mínimo de 3 caracteres." });
      return { options: [], additional, hasMore: true };
    }

    const curPage = additional!.page;
    const pageSize = additional!.itemsPerPage;

    const response = await getProducts({
      searchValue: input.trim(),
      active: true,
      limit: pageSize,
      page: curPage,
    });

    if (!response.data) {
      console.log("error fetching products");
      return { options: [], additional, hasMore: true };
    }

    const products = response.data.results;

    return {
      options: products.map((product) => ({
        value: product,
        label: product.name,
      })),
      additional: { itemsPerPage: pageSize, page: curPage + 1 },
      hasMore: curPage * pageSize < response.data.pagination.totalItems,
    };
  };

  const { quantity, salePrice, costPrice } = form.watch();

  const subTotal = useMemo(
    () => (salePrice - costPrice) * Number(quantity),
    [quantity, salePrice]
  );

  useEffect(() => {
    if (subTotal == undefined || salePrice <= 0) return;
    /* form.clearErrors("discount");

    if (subTotal <= 0) {
      form.setError("discount", {
        message: "valor de desconto inválido.",
      });
    } */
  }, [subTotal, quantity, salePrice]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 gap-2">
          <PlusIcon className="size-4" />
          Adicionar produto
        </Button>
      </DialogTrigger>
      <DialogContent className="!p-0 flex flex-col no-scrollbar md:max-w-2xl h-fit overflow-hidden">
        <DialogHeader className="p-5 bg-primary-foreground">
          <DialogTitle>Adicionar produto</DialogTitle>
          <DialogDescription>
            Faça inserções para novo produto aqui. Clique em salvar quando
            terminar.
          </DialogDescription>
        </DialogHeader>
        <Form<OrderItemFormType> {...form}>
          <form className="w-full overflow-y-auto no-scrollbar flex flex-col gap-4 p-5">
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="product.id" className="text-right">
                Produto
              </Label>
              <Controller
                control={form.control}
                name="id"
                render={({ field: { onChange } }) => (
                  <div className="w-full flex flex-col gap-2">
                    {form.formState.errors.id && (
                      <span className="text-sm text-destructive">
                        {form.formState.errors.id.message}
                      </span>
                    )}
                    <SelectPaginated<Product>
                      className="text-sm"
                      placeholder="Buscar um produto..."
                      menuPlacement="bottom"
                      loadOptions={loadPaginatedSearchProducts}
                      debounceTimeout={1000}
                      onInputChange={() => form.clearErrors("id")}
                      onChange={(option) => {
                        onChange(option!.value.id);
                        form.setValue("name", option!.label);
                        form.setValue("salePrice", option!.value.salePrice);
                        form.setValue("costPrice", option!.value.costPrice);
                      }}
                      additional={{
                        page: 1,
                        itemsPerPage: 10,
                      }}
                    />
                    {salePrice > 0 && (
                      <p className="opacity-80 text-[13px]">
                        Preço de venda: {CurrencyFormatter.format(salePrice)}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="flex flex-col items-start gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantidade
              </Label>
              <Controller
                control={form.control}
                name="quantity"
                render={({ field: { name, value, onChange } }) => (
                  <div className="w-full flex flex-col gap-2">
                    <NumericFormat
                      customInput={Input}
                      className="h-9"
                      placeholder="Quantidade do item"
                      name={name}
                      value={value}
                      onChange={onChange}
                    />
                    {form.formState.errors.quantity && (
                      <span className="text-sm text-destructive">
                        {form.formState.errors.quantity.message}
                      </span>
                    )}
                  </div>
                )}
              />
            </div>
            {/* Discount */}
            {/* <div className="flex flex-col gap-3">
              <div className="flex flex-col">
                <Heading>Desconto</Heading>
                <Paragraph className="text-xs">
                  Aplique um desconto ao produto.
                </Paragraph>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="discount.variant"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variante</FormLabel>
                      <FormControl>
                        <Select
                          name={field.name}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full h-9">
                            <SelectValue placeholder="Escolha um método de pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Dinheiro</SelectItem>
                            <SelectItem value="percentage">
                              Porcentagem
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discount.amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantia</FormLabel>
                      <FormControl>
                        <NumericFormat
                          customInput={Input}
                          className="h-9"
                          placeholder="Valor do desconto"
                          prefix={
                            discount.variant === "cash" ? "R$" : undefined
                          }
                          suffix={
                            discount.variant === "percentage" ? "%" : undefined
                          }
                          decimalScale={2}
                          fixedDecimalScale={true}
                          thousandSeparator={
                            discount.variant === "cash" ? "." : undefined
                          }
                          decimalSeparator=","
                          name={field.name}
                          value={field.value}
                          onChange={({ target }) => {
                            field.onChange(NumericParser.parse(target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {form.formState.errors.discount && (
                <p className="text-destructive text-[13px]">
                  {form.formState.errors.discount.message}
                </p>
              )}
              {!!subTotal && subTotal > 0 && (
                <p className="opacity-80 text-[13px]">
                  Subtotal: {CurrencyFormatter.format(subTotal)}
                </p>
              )}
            </div> */}
          </form>
          <DialogFooter className="p-5 bg-primary-foreground/25">
            <Button className="min-w-32" type="button" onClick={onSubmit}>
              Adicionar item
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

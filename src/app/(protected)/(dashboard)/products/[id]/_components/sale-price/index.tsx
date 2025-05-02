"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { updateProductSalePriceAction } from "../../_actions/update-product-sale-price";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CheckIcon, PencilIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type RenderMode = "VIEW" | "EDIT";

type SalePriceProps = {
  productId: string;
  tenantId: string;
  defaultValue: number;
};

type FormValues = {
  value: number;
};

export const SalePrice: FC<SalePriceProps> = ({
  productId,
  tenantId,
  defaultValue,
}) => {
  const [renderMode, setRenderMode] = useState<RenderMode>("VIEW");

  const form = useForm<FormValues>({
    defaultValues: {
      value: defaultValue,
    },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
    watch,
  } = form;

  const watchedValue = watch("value");

  const toggleRenderMode = () =>
    setRenderMode(renderMode === "VIEW" ? "EDIT" : "VIEW");

  const onSubmit = async (data: FormValues) => {
    if (data.value === defaultValue) {
      reset();
      return;
    }

    const result = await updateProductSalePriceAction({
      productId,
      tenantId,
      value: data.value,
    });

    if ("error" in result) {
      toast.error("Erro ao atualizar", {
        description: "Não foi possível atualizar o preço do produto.",
      });
      return;
    }

    toast.success("Preço atualizado", {
      description: "Preço de venda do produto atualizado com sucesso.",
    });
    setRenderMode("VIEW");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2"
      >
        <p className="font-bold text-sm">Preço de venda</p>
        {renderMode === "EDIT" ? (
          <div className="relative">
            <FormField
              control={control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <NumericFormat
                      value={field.value === 0 ? "" : field.value}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      allowNegative={false}
                      decimalScale={2}
                      fixedDecimalScale
                      customInput={Input}
                      onValueChange={({ floatValue }) => {
                        field.onChange(floatValue ?? 0);
                      }}
                      onFocus={(e) => {
                        if (field.value === 0) {
                          e.currentTarget.setSelectionRange(
                            e.currentTarget.value.length,
                            e.currentTarget.value.length
                          );
                        }
                      }}
                      placeholder="R$ 0,00"
                      className="w-full h-9 border rounded-md bg-secondary pl-3 pr-9 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="absolute -bottom-5 left-0 text-xs" />
                </FormItem>
              )}
            />
            <div className="absolute top-2 right-2 flex items-center justify-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => {
                  reset();
                  toggleRenderMode();
                  toast.info("Edição cancelada", {
                    description: "As alterações não foram salvas.",
                  });
                }}
                className="size-7"
              >
                <XIcon className="size-4" />
              </Button>
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                disabled={!isDirty}
                className="size-7"
              >
                <CheckIcon className={cn("size-4", !isDirty && "opacity-50")} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-9 border rounded-md bg-secondary flex items-center justify-between px-3 text-sm">
            <span>
              {watchedValue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="size-7"
              onClick={toggleRenderMode}
            >
              <PencilIcon className="size-4" />
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
};

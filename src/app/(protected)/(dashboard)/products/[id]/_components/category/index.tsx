"use client";

import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CheckIcon, CopyIcon, PencilIcon, XIcon } from "lucide-react";

import { updateProductNameAction } from "../../_actions/update-product-name";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { updateProductCategoryAction } from "../../_actions/update-product-category";
import { getCategoriesAction } from "../../../_actions/get-categories";

type RenderMode = "VIEW" | "EDIT";

type CategoryProps = {
  productId: string;
  tenantId: string;
  defaultValue: string | null;
};

type FormValues = {
  value: string | null;
};

export const Category: FC<CategoryProps> = ({
  defaultValue = null,
  productId,
  tenantId,
}) => {
  const [renderMode, setRenderMode] = useState<RenderMode>("VIEW");

  const toggleRenderMode = () =>
    setRenderMode(renderMode === "VIEW" ? "EDIT" : "VIEW");

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

  const onSubmit = async (data: FormValues) => {
    const promises = [];

    if (data.value !== defaultValue) {
      promises.push(
        updateProductCategoryAction({
          productId,
          tenantId,
          categoryId: data.value === "none" ? null : data.value,
        })
      );
    }

    const results = await Promise.all(promises);

    const hasError = results.some((res) => "error" in res);

    if (hasError) {
      toast.error("Falha na atualização", {
        description:
          "Não foi possível atualizar o produto. Por favor, tente novamente.",
      });
      return;
    }

    toast.success("Produto atualizado", {
      description: "Nome e/ou categoria atualizados com sucesso.",
    });

    toggleRenderMode();
  };

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  const loadCategories = async () => {
    const result = await getCategoriesAction({ tenantId });

    if (result.isFailure) {
      return;
    }

    const { categories } = result.value;

    setCategories(categories);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2"
      >
        <p className="font-bold text-sm">Nome do produto</p>
        {renderMode === "EDIT" ? (
          <div className="relative space-y-2">
            {/* Categoria */}
            <FormField
              control={control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? "none"}
                    >
                      <SelectTrigger className="h-9 bg-secondary text-sm w-full">
                        <SelectValue placeholder="Sem categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sem categoria</SelectItem>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Botões */}
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
          <div className="h-9 border rounded-md bg-secondary flex items-center justify-between px-3">
            <span className="text-sm">
              {categories.find((c) => c.id === watchedValue)?.name ??
                "Sem categoria"}
            </span>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="size-7"
                onClick={toggleRenderMode}
              >
                <PencilIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};

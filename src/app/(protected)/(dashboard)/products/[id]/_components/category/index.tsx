"use client";

import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  XIcon,
} from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateProductCategoryAction } from "../../_actions/update-product-category";
import { getCategoriesAction } from "../../../categories/_actions/get-categories";
import { ProductCategory } from "../../../_actions/get-detailed-product";

type RenderMode = "VIEW" | "EDIT";

type CategoryProps = {
  productId: string;
  tenantId: string;
  defaultValue: ProductCategory | null;
};

type FormValues = {
  value: string | null;
};

const PAGE_SIZE = 10;

export const Category: FC<CategoryProps> = ({
  defaultValue = null,
  productId,
  tenantId,
}) => {
  const [renderMode, setRenderMode] = useState<RenderMode>("VIEW");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const toggleRenderMode = () =>
    setRenderMode(renderMode === "VIEW" ? "EDIT" : "VIEW");

  const form = useForm<FormValues>({
    defaultValues: {
      value: defaultValue?.id,
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

  const loadCategories = async (page: number = 1) => {
    setIsLoading(true);

    const result = await getCategoriesAction({
      tenantId,
      page,
      pageSize: PAGE_SIZE,
    });

    if (result.isFailure) {
      setIsLoading(false);
      return;
    }

    const { categories, pagination } = result.value;
    setCategories(categories);
    setTotalPages(pagination.totalPages);
    setCurrentPage(pagination.currentPage);
    setIsLoading(false);
  };

  useEffect(() => {
    if (renderMode === "EDIT") {
      loadCategories();
    }
  }, [renderMode]);

  const onSubmit = async (data: FormValues) => {
    if (data.value && data.value !== defaultValue?.id) {
      const result = await updateProductCategoryAction({
        productId,
        tenantId,
        categoryId: data.value,
      });

      if ("error" in result) {
        toast.error("Falha na atualização", {
          description: "Não foi possível atualizar a categoria do produto.",
        });
        return;
      }

      toast.success("Produto atualizado", {
        description: "Categoria atualizada com sucesso.",
      });
    }

    toggleRenderMode();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2"
      >
        <p className="font-bold text-sm">Categoria</p>
        {renderMode === "EDIT" ? (
          <div className="relative space-y-2">
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
                        <div className="flex justify-between items-center px-2 py-1 border-t">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={currentPage <= 1 || isLoading}
                            onClick={() => loadCategories(currentPage - 1)}
                          >
                            <ChevronUpIcon className="size-4" />
                          </Button>
                          <span className="text-xs text-muted-foreground">
                            Página {currentPage} de {totalPages}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={currentPage >= totalPages || isLoading}
                            onClick={() => loadCategories(currentPage + 1)}
                          >
                            <ChevronDownIcon className="size-4" />
                          </Button>
                        </div>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
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
              {defaultValue?.name ?? "Sem categoria"}
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

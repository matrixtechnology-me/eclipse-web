"use client";

import { FC, useState } from "react";
import { updateProductDescriptionAction } from "../../_actions/update-product-description";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon, PencilIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type RenderMode = "VIEW" | "EDIT";

type DescriptionProps = {
  productId: string;
  tenantId: string;
  defaultValue: string;
};

type FormValues = {
  value: string;
};

export const Description: FC<DescriptionProps> = ({
  defaultValue = "",
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

  const watchedValue = watch().value;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(watchedValue)
      .then(() => {
        toast.success("Descrição copiada", {
          description: "Texto copiado para a área de transferência.",
        });
      })
      .catch((err) => {
        toast.error("Falha ao copiar", {
          description: "Erro ao tentar copiar a descrição.",
        });
        console.error("failed to copy: ", err);
      });
  };

  const onSubmit = async (data: FormValues) => {
    if (data.value === defaultValue) {
      reset();
      return;
    }

    const result = await updateProductDescriptionAction({
      value: data.value,
      productId,
      tenantId,
    });

    if ("error" in result) {
      toast.error("Falha na atualização", {
        description:
          "Não foi possível atualizar a descrição do produto. Por favor, tente novamente.",
      });
      return;
    }

    toast.success("Descrição atualizada", {
      description: "A descrição do produto foi atualizada com sucesso.",
    });
    setRenderMode("VIEW");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2"
      >
        <p className="font-bold text-sm">Descrição do produto</p>
        {renderMode === "EDIT" ? (
          <div className="relative">
            <FormField
              control={control}
              name="value"
              rules={{
                required: "Descrição é obrigatória",
                minLength: {
                  value: 5,
                  message: "Mínimo de 5 caracteres",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="w-full border rounded-md bg-secondary pl-3 pr-9 text-sm min-h-[80px]"
                      {...field}
                      maxLength={500}
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
                  form.reset();
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
          <div className="border rounded-md bg-secondary flex justify-between items-start px-3 py-2 min-h-[80px]">
            <span className="text-sm whitespace-pre-line">{watchedValue}</span>
            <div className="flex items-start gap-1 mt-1">
              <Button
                size="icon"
                variant="ghost"
                className="size-7"
                onClick={handleCopy}
              >
                <CopyIcon className="size-4" />
              </Button>
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

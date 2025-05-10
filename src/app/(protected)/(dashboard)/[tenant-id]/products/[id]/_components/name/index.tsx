"use client";

import { FC, useState } from "react";
import { updateProductNameAction } from "../../_actions/update-product-name";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon, PencilIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type RenderMode = "VIEW" | "EDIT";

type NameProps = {
  productId: string;
  tenantId: string;
  defaultValue: string;
};

type FormValues = {
  value: string;
};

export const Name: FC<NameProps> = ({
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
        toast.success("Nome copiado", {
          description: "O nome foi copiado para a área de transferência.",
        });
      })
      .catch((err) => {
        toast.error("Falha ao copiar", {
          description: "Ocorreu um erro ao tentar copiar o nome.",
        });
        console.error("failed to copy: ", err);
      });
  };

  const onSubmit = async (data: FormValues) => {
    if (data.value === defaultValue) {
      reset();
      return;
    }

    const result = await updateProductNameAction({
      value: data.value,
      productId,
      tenantId,
    });

    if ("error" in result) {
      toast.error("Falha na atualização", {
        description:
          "Não foi possível atualizar o nome do produto. Por favor, tente novamente.",
      });
      return;
    }

    toast.success("Nome atualizado", {
      description: "O nome do produto foi atualizado com sucesso.",
    });
    setRenderMode("VIEW");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2"
      >
        <p className="font-bold text-sm">Nome do produto</p>
        {renderMode === "EDIT" ? (
          <div className="relative">
            <FormField
              control={control}
              name="value"
              rules={{
                required: "Nome do produto é obrigatório",
                minLength: {
                  value: 3,
                  message: "Mínimo de 3 caracteres",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="w-full h-9 border rounded-md bg-secondary pl-3 pr-9 text-sm"
                      {...field}
                      maxLength={100}
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
          <div className="h-9 border rounded-md bg-secondary flex items-center justify-between px-3">
            <span className="text-sm">{watchedValue}</span>
            <div className="flex items-center gap-1">
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

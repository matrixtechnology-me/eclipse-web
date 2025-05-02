"use client";

import { FC, useState } from "react";
import { updateCustomerPhoneNumberAction } from "../../_actions/update-customer-phone-number";
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
import {
  CheckIcon,
  CopyIcon,
  PencilIcon,
  XIcon,
  PhoneIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type RenderMode = "VIEW" | "EDIT";

type PhoneNumberProps = {
  customerId: string;
  tenantId: string;
  defaultValue: string;
};

type FormValues = {
  value: string;
};

export const PhoneNumber: FC<PhoneNumberProps> = ({
  defaultValue = "",
  customerId,
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
        toast.success("Número copiado", {
          description:
            "O número de telefone foi copiado para a área de transferência.",
        });
      })
      .catch((err) => {
        toast.error("Falha ao copiar", {
          description: "Ocorreu um erro ao tentar copiar o número.",
        });
        console.error("failed to copy: ", err);
      });
  };

  const onSubmit = async (data: FormValues) => {
    if (data.value === defaultValue) {
      reset();
      return;
    }

    const result = await updateCustomerPhoneNumberAction({
      value: data.value,
      customerId,
      tenantId,
    });

    if ("error" in result) {
      toast.error("Falha na atualização", {
        description:
          "Não foi possível atualizar o número de telefone. Por favor, tente novamente.",
      });
      return;
    }

    toast.success("Número atualizado", {
      description: "O número de telefone foi atualizado com sucesso.",
    });
    setRenderMode("VIEW");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-2"
      >
        <p className="font-bold text-sm">Telefone</p>
        {renderMode === "EDIT" ? (
          <div className="relative">
            <FormField
              control={control}
              name="value"
              rules={{
                required: "Número de telefone é obrigatório",
                pattern: {
                  value: /^[0-9()+\-\s]+$/,
                  message: "Número de telefone inválido",
                },
                minLength: {
                  value: 8,
                  message: "Mínimo de 8 caracteres",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        className="w-full h-9 border rounded-md bg-secondary pl-9 pr-9 text-sm"
                        {...field}
                        maxLength={20}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
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
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{watchedValue || "Não informado"}</span>
            </div>
            <div className="flex items-center gap-1">
              {watchedValue && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  onClick={handleCopy}
                >
                  <CopyIcon className="size-4" />
                </Button>
              )}
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

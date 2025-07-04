"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { FC, ReactNode, useMemo, useState } from "react";
import { EPaymentMethod, EPosStatus, ESaleMovementType } from "@prisma/client";
import TitledStepper from "@/components/titled-stepper";
import { ExchangeSaleFormStep } from "./_steps/sale";
import { ExchangeProductsFormStep } from "./_steps/products";
import { ExchangePricingFormStep } from "./_steps/pricing";
// import { createPosSalePaymentAction } from "./_actions/create-pos-sale-payment";
// import { revalidate } from "./_actions/revalidate";

// This data willa also be used for rendering.
// Not all this structure is used for data collection.
const formSchema = z.object({
  customerId: z
    .string({ required_error: "Campo obrigatório." })
    .min(1, "Campo obrigatório."),
  sale: z
    .object({
      id: z.string(),
      paidTotal: z.number().gte(0.0),
      estimatedTotal: z.number().gt(0.0),
      totalItems: z.number().gt(0.0),
      products: z.array(
        z.object({
          itemId: z.string(), // zod fieldArrays have internal 'id' prop.
          name: z.string(),
          salePrice: z.number().gt(0.0),
          totalQty: z.number().gt(0.0),
          productId: z.string(),
        }),
      ),
      movements: z.array(
        z.object({
          type: z.nativeEnum(ESaleMovementType),
          amount: z.number().gt(0.0),
          paymentMethod: z.nativeEnum(EPaymentMethod),
        }),
      ),
    }, { required_error: "Campo obrigatório." }),
  discount: z.object({
    value: z.number().gt(0.0, "Valor deve ser maior que zero."),
    type: z.enum(["cash", "percentage"]),
  })
    .optional()
    .refine(arg => {
      if (!arg || arg.type == "cash") return true;
      return arg.value < 1;
    }, {
      message: "Porcentagem deve ser menor que 100%.",
      path: ["value"],
    }),
  products: z.object({
    returned: z.array(
      z.object({
        productId: z.string(),
        salePrice: z.number().gt(0.0),
        totalQty: z.number().gt(0.0),
      }),
    ).min(1, "Mínimo de um item."),
    replacement: z.array(
      z.object({
        productId: z.string(),
        name: z.string(),
        salePrice: z.number().gt(0.0),
        quantity: z.number().gt(0.0),
      }),
    ).min(1, "Mínimo de um item."),
  }),
  movements: z.array(
    z.object({
      type: z.nativeEnum(ESaleMovementType),
      amount: z.number().gt(0.0),
      paymentMethod: z.nativeEnum(EPaymentMethod),
    }),
  ),
});

export type FormSchema = z.infer<typeof formSchema>;

type AddExchangeProps = {
  posId: string;
  posStatus: EPosStatus;
  tenantId: string;
};

type FormStep = {
  step: number;
  title: string;
  element: ReactNode;
}

const formDefaultValues = {
  customerId: undefined,
  sale: undefined,
  discount: undefined,
  products: {
    replacement: [],
    returned: [],
  },
  movements: [],
}

export const AddExchange: FC<AddExchangeProps> = ({
  posId,
  posStatus,
  tenantId,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);

  const form = useForm<FormSchema>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  const onSubmit = async (formData: FormSchema) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(formData);
    // const result = await createPosSalePaymentAction({
    //   ...formData,
    //   tenantId,
    // });

    // if (result.isFailure) {
    //   return toast("Erro", {
    //     description: "Não foi possível criar um novo ponto de venda",
    //   });
    // }

    // revalidate({ posId, tenantId });

    // setOpen(false);
    // form.reset();
    // toast("Pagamento criado com sucesso");
  };

  const handleCancel = () => {
    form.reset(formDefaultValues);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setOpen(false);
  }

  const formSteps: FormStep[] = useMemo(() => [
    {
      step: 1,
      title: "Venda",
      element:
        <ExchangeSaleFormStep
          tenantId={tenantId}
          onCancel={handleCancel}
          onContinue={() => setStep(2)}
        />,
    },
    {
      step: 2,
      title: "Produtos",
      element:
        <ExchangeProductsFormStep
          tenantId={tenantId}
          onPrev={() => setStep(1)}
          onContinue={() => setStep(3)}
        />,
    },
    {
      step: 3,
      title: "Precificação",
      element:
        <ExchangePricingFormStep
          onPrev={() => setStep(2)}
          onContinue={form.handleSubmit(onSubmit)}
        />,
    },
  ], [tenantId]);

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) return handleClose(); // reset step
      setOpen(true);
    }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={posStatus !== EPosStatus.Opened}
        >
          Nova Troca
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-3xl max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Realizar troca</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col gap-3 min-h-[300px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
          >
            <div className="flex-1 flex flex-col gap-4">
              <TitledStepper steps={formSteps} currentStep={step} />

              {formSteps[step - 1].element}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

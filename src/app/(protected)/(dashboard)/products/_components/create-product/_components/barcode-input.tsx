"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forwardRef, useTransition } from "react";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { generateBarcodeAction } from "../../../_actions/generate-barcode";
import { RefreshCwIcon } from "lucide-react";

interface BarcodeInputProps {
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
}

export const BarcodeInput = forwardRef<HTMLInputElement, BarcodeInputProps>(
  ({ onChange, value, placeholder, ...props }, ref) => {
    const [isPending, startTransition] = useTransition();

    const handleGenerate = () => {
      startTransition(async () => {
        const result = await generateBarcodeAction({});

        if (result.isFailure) {
          toast.error("Erro ao gerar código de barras");
          return;
        }

        const { barCode } = result.value;

        onChange(barCode);
        toast.success("Código de barras gerado");
      });
    };

    return (
      <div className="flex gap-2">
        <PatternFormat
          getInputRef={ref}
          format="#############"
          mask="_"
          placeholder={placeholder}
          value={value}
          onValueChange={(values) => onChange(values.value)}
          customInput={Input}
          className="flex-1"
          {...props}
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleGenerate}
          disabled={isPending}
          className="shrink-0"
        >
          {isPending ? (
            <RefreshCwIcon className="animate-spin size-4" />
          ) : (
            "Gerar"
          )}
        </Button>
      </div>
    );
  }
);

BarcodeInput.displayName = "BarcodeInput";

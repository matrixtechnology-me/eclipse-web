"use client";

import { FC, useState } from "react";
import { CopyIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PhoneNumberFormatter } from "@/utils/formatters/phone-number";

type PhoneNumberProps = {
  value: string;
};

export const PhoneNumber: FC<PhoneNumberProps> = ({ value = "" }) => {
  const [showPhone, setShowPhone] = useState(false);
  const handleCopy = () => {
    navigator.clipboard
      .writeText(PhoneNumberFormatter.format(value))
      .then(() => {
        toast.success("Telefone copiado", {
          description: "O número foi copiado para a área de transferência.",
        });
      })
      .catch((err) => {
        toast.error("Falha ao copiar", {
          description: "Ocorreu um erro ao tentar copiar o número.",
        });
        console.error("failed to copy: ", err);
      });
  };

  const toggleVisibility = () => {
    setShowPhone(!showPhone);
  };

  return (
    <div className="h-9 border rounded-md bg-secondary flex items-center justify-between px-3">
      <span className="text-sm">
        {showPhone
          ? PhoneNumberFormatter.format(value)
          : "*".repeat(PhoneNumberFormatter.format(value).length)}
      </span>
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          variant="ghost"
          className="size-7"
          onClick={toggleVisibility}
        >
          {showPhone ? (
            <EyeOffIcon className="size-4" />
          ) : (
            <EyeIcon className="size-4" />
          )}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-7"
          onClick={handleCopy}
        >
          <CopyIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};

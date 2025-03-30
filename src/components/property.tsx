"use client";

import { FC } from "react";
import { Button } from "./ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

type PropertyProps = {
  label: string;
  value: string | number;
  copyable?: boolean;
};

export const Property: FC<PropertyProps> = ({
  label,
  value,
  copyable = false,
}) => {
  const handleCopy = (value: string | number) => {
    return () =>
      navigator.clipboard
        .writeText(String(value))
        .then(() => {
          toast("Copiado para a área de transferência", {
            description: `O valor "${value}" foi copiado com sucesso e já está disponível para uso.`,
          });
        })
        .catch((err) => {
          console.error("failed to copy: ", err);
        });
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold text-sm">{label}</p>
      <div className="h-9 border rounded-md bg-secondary flex items-center justify-between px-3">
        <span className="text-sm">{value}</span>
        {copyable ? (
          <Button
            size="icon"
            variant="link"
            className="size-fit"
            onClick={handleCopy(value)}
          >
            <CopyIcon className="size-4" />
          </Button>
        ) : null}
      </div>
    </div>
  );
};

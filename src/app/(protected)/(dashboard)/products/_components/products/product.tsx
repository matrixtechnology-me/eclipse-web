import { CurrencyFormatter } from "@/utils/formatters/currency";
import { Package, CheckCircle2, XCircle } from "lucide-react";
import { HTMLAttributes } from "react";

type ProductProps = {
  data: {
    id: string;
    name: string;
    barCode: string;
    active: boolean;
    salePrice: number;
  };
} & HTMLAttributes<HTMLDivElement>;

export const Product = ({ data, ...rest }: ProductProps) => {
  return (
    <div
      className="border rounded-sm p-4 hover:shadow-sm transition-shadow bg-card"
      {...rest}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-sm bg-primary/10 flex items-center justify-center">
            <Package className="size-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium line-clamp-1">{data.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">
                {CurrencyFormatter.format(data.salePrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {data.active ? (
            <CheckCircle2 className="size-5 text-green-500" />
          ) : (
            <XCircle className="size-5 text-red-500" />
          )}
          <span className="text-sm">{data.active ? "Ativo" : "Inativo"}</span>
        </div>
      </div>

      {data.barCode && (
        <div className="mt-3 text-xs text-muted-foreground">
          Código: {data.barCode}
        </div>
      )}
    </div>
  );
};

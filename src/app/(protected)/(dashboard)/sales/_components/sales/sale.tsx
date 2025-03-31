import { UserIcon, ShoppingCart, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { PATHS } from "@/config/paths";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { formatPhoneNumber } from "../../_utils/phone-number-format";

type SaleProps = {
  data: {
    id: string;
    costPrice: number;
    salePrice: number;
    totalItems: number;
    status: "completed" | "pending" | "canceled";
    customer: {
      id: string;
      name: string;
      phoneNumber: string;
    };
  };
};

export const Sale = ({ data }: SaleProps) => {
  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      color: "text-green-500",
      label: "Concluída",
    },
    pending: {
      icon: ShoppingCart,
      color: "text-yellow-500",
      label: "Pendente",
    },
    canceled: { icon: XCircle, color: "text-red-500", label: "Cancelada" },
  };

  const StatusIcon = statusConfig[data.status].icon;

  return (
    <Link
      href={PATHS.PROTECTED.SALES.SALE(data.id).INDEX}
      className="w-full border rounded-lg p-4 hover:shadow-md transition-shadow bg-card"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="size-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">{data.customer.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatPhoneNumber(data.customer.phoneNumber)}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-1 ${
            statusConfig[data.status].color
          }`}
        >
          <StatusIcon className="size-4" />
          <span className="text-sm">{statusConfig[data.status].label}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-muted-foreground">Itens</p>
          <p>{data.totalItems}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Valor</p>
          <p className="font-medium">
            {CurrencyFormatter.format(data.salePrice * data.totalItems)}
          </p>
        </div>
      </div>

      {data.status === "completed" && (
        <div className="mt-2 text-xs text-muted-foreground">
          Lucro:{" "}
          {CurrencyFormatter.format(
            (data.salePrice - data.costPrice) * data.totalItems
          )}
        </div>
      )}
    </Link>
  );
};

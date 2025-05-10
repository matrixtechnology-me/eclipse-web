import { UserIcon, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { PATHS } from "@/config/paths";
import { CurrencyFormatter } from "@/utils/formatters/currency";
import { formatPhoneNumber } from "../../../_utils/phone-number-format";
import { ESaleStatus } from "@prisma/client";

type SaleProps = {
  data: {
    id: string;
    costPrice: number;
    salePrice: number;
    totalItems: number;
    status: ESaleStatus;
    customer: {
      id: string;
      name: string;
      phoneNumber: string;
    };
  };
  tenantId: string;
};

export const Sale = ({ data, tenantId }: SaleProps) => {
  const statusConfig = {
    [ESaleStatus.Processed]: {
      icon: CheckCircle2,
      color: "text-green-500",
      label: "Concluída",
    },
    [ESaleStatus.Canceled]: {
      icon: XCircle,
      color: "text-red-500",
      label: "Cancelada",
    },
  };

  const StatusIcon = statusConfig[data.status].icon;

  const totalSaleValue = data.salePrice;
  const totalCost = data.costPrice;
  const profit = totalSaleValue - totalCost;

  return (
    <Link
      href={PATHS.PROTECTED.DASHBOARD(tenantId).SALES.SALE(data.id).INDEX}
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
          <p className="text-muted-foreground">Total</p>
          <p className="font-medium">
            {CurrencyFormatter.format(totalSaleValue)}
          </p>
        </div>
      </div>

      {data.status === ESaleStatus.Processed && (
        <div className="mt-2 text-xs text-muted-foreground">
          Lucro:{" "}
          <span className="font-medium">
            {CurrencyFormatter.format(profit)}
          </span>
        </div>
      )}
    </Link>
  );
};

import { CircleCheck, User, XCircle, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Customer as CustomerType } from "../../../_actions/get-customers";
import { formatPhoneNumber } from "../../../_utils/phone-number-format";

type CustomerProps = {
  data: CustomerType;
};

export const Customer = ({ data }: CustomerProps) => {
  return (
    <div className="border rounded-sm p-4 hover:shadow-sm transition-shadow bg-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="size-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">{data.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="size-4" />
              <span>{formatPhoneNumber(data.phoneNumber)}</span>
            </div>
          </div>
        </div>
        <Badge
          variant={data.active ? "secondary" : "destructive"}
          className="gap-1.5"
        >
          {data.active ? (
            <CircleCheck className="size-3.5" />
          ) : (
            <XCircle className="size-3.5" />
          )}
          <span>{data.active ? "Ativo" : "Inativo"}</span>
        </Badge>
      </div>
    </div>
  );
};

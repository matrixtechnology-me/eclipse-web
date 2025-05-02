import { CircleCheck, User, XCircle, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type CustomerProps = {
  data: {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export const Customer = ({ data }: CustomerProps) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-sm transition-shadow bg-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="size-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium">{data.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{data.description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

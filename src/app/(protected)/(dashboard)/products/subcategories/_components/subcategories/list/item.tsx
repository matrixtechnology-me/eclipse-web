import { FC } from "react";
import moment from "moment";
import { cn } from "@/lib/shadcn";

type ItemProps = {
  name: string;
  description: string;
  createdAt: Date;
  className?: string;
};

export const Item: FC<ItemProps> = ({
  name,
  description,
  createdAt,
  className,
}) => {
  return (
    <div
      className={cn("border rounded-lg p-4 h-full flex flex-col", className)}
    >
      <h3 className="font-medium text-lg mb-2 line-clamp-1">{name}</h3>
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {description || "Nenhuma descrição"}
      </p>
      <div className="mt-auto text-xs text-muted-foreground">
        Criado em: {moment(createdAt).format("DD/MM/YYYY")}
      </div>
    </div>
  );
};

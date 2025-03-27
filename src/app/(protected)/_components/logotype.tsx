import { cn } from "@/lib/shadcn";
import { EclipseIcon } from "lucide-react";
import { FC, HTMLAttributes } from "react";

export const Logotype: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
  return (
    <div className={cn("flex items-center gap-3", className)} {...rest}>
      <div className="size-9 border bg-secondary rounded-full flex items-center justify-center">
        <EclipseIcon className="size-6 text-primary" />
      </div>
      <span className="text-lg font-stretch-75% font-bold text-primary">
        E C L I P S E
      </span>
    </div>
  );
};

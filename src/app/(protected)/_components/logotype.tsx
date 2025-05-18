"use client";

import { cn } from "@/lib/shadcn";
import { EclipseIcon } from "lucide-react";
import { FC, HTMLAttributes } from "react";

export const Logotype: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
  return (
    <div
      className={cn("flex-1 flex items-center justify-center gap-3", className)}
      {...rest}
    >
      <EclipseIcon className="size-6 text-primary" />
      <span className="font-bold text-sm">E C L I P S E</span>
    </div>
  );
};

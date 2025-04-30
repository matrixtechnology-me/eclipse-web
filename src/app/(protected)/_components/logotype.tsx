"use client";

import { Button } from "@/components/ui/button";
import { PATHS } from "@/config/paths";
import { cn } from "@/lib/shadcn";
import { EclipseIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, HTMLAttributes } from "react";

export const Logotype: FC<HTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...rest
}) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(PATHS.PROTECTED.DASHBOARD.HOMEPAGE);
  };

  return (
    <Button
      variant="outline"
      className={cn(
        "h-10 rounded-full flex items-center justify-center gap-3 px-2 pr-3",
        className
      )}
      onClick={handleRedirect}
      {...rest}
    >
      <EclipseIcon className="size-6 text-primary" />
      <span className="font-bold text-sm">E C L I P S E</span>
    </Button>
  );
};

"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CategoryProps = {
  name: string;
  description: string;
};

export const Category = ({ description, name }: CategoryProps) => {
  return (
    <button className="w-full h-16 flex items-center justify-start gap-3 px-5 border-b">
      <div className="flex-1 flex flex-col items-start">
        <span className="text-sm font-medium line-clamp-1">{name}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-start text-xs text-muted-foreground line-clamp-1">
                {description}
              </p>
            </TooltipTrigger>
            <TooltipContent className="border bg-secondary text-secondary-foreground">
              <p>{description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </button>
  );
};

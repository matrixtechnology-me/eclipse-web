import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";

type ContentProps = {
  children: React.ReactNode;
};

export const Content: FC<ContentProps> = ({ children }) => {
  return (
    <ScrollArea className="flex-1 h-[calc(100dvh-128px)]">
      <div className="w-full h-full max-w-7xl mx-auto">{children}</div>
    </ScrollArea>
  );
};

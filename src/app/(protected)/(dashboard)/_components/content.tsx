import { ScrollArea } from "@/components/ui/scroll-area";
import { FC } from "react";

type ContentProps = {
  children: React.ReactNode;
};

export const Content: FC<ContentProps> = ({ children }) => {
  return (
    <ScrollArea className="w-full flex-1 h-[calc(100dvh-64px)]">
      {children}
    </ScrollArea>
  );
};

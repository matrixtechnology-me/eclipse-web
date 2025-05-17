import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Dispatch, FC, SetStateAction } from "react";

type ToggleCollapseProps = {
  collapsed: boolean;
  onCollapse: Dispatch<SetStateAction<boolean>>;
};

export const ToggleCollapse: FC<ToggleCollapseProps> = ({
  collapsed,
  onCollapse,
}) => {
  const toggleCollapse = () => onCollapse((prev) => !prev);

  return (
    <Button
      variant="ghost"
      className="absolute -right-3 top-[52px] z-10 flex h-6 w-6 bg-background cursor-pointer items-center justify-center rounded-sm border border-solid p-0 pr-[2px] shadow-sm max-md:hidden"
      onClick={toggleCollapse}
    >
      {collapsed ? (
        <ChevronRightIcon className="ml-1 size-4" />
      ) : (
        <ChevronLeftIcon className="size-4" />
      )}
    </Button>
  );
};

import { EclipseIcon } from "lucide-react";
import { FC } from "react";

type HeaderProps = {
  isCollapsed: boolean;
};

export const Header: FC<HeaderProps> = ({ isCollapsed }) => {
  return (
    <div className="w-full h-16 border-b flex items-center justify-center gap-3">
      <EclipseIcon className="size-6 text-primary" />
      {!isCollapsed && <span className="font-bold text-sm">E C L I P S E</span>}
    </div>
  );
};

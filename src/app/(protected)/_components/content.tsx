import { FC } from "react";

type ContentProps = {
  children: React.ReactNode;
};

export const Content: FC<ContentProps> = ({ children }) => {
  return (
    <div className="flex-1 p-5">
      <div className="w-full max-w-7xl mx-auto">{children}</div>
    </div>
  );
};

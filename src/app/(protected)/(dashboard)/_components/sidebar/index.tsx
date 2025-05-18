"use client";

import { HTMLAttributes, useState } from "react";
import { Nav } from "./nav";
import { cn } from "@/lib/shadcn";
import { Header } from "./header";
import { Footer } from "./footer";
import { ToggleCollapse } from "./toggle-collapse";

export const Sidebar = ({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div
      className={cn(
        "relative h-full flex-col items-center justify-between border-r hidden duration-150 ease-in-out md:flex",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      {...rest}
    >
      <ToggleCollapse collapsed={isCollapsed} onCollapse={setIsCollapsed} />
      <Header isCollapsed={isCollapsed} />
      <Nav isCollapsed={isCollapsed} />
      <Footer />
    </div>
  );
};

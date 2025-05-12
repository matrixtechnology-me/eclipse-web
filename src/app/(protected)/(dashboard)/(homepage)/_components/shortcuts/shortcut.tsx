"use client";

import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";

type ShortcutProps = {
  icon: LucideIcon;
  label: string;
  path: string;
};

export const Shortcut: FC<ShortcutProps> = ({ icon: Icon, label, path }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(path);
  };

  return (
    <button
      onClick={handleNavigate}
      className="flex-1 flex flex-col items-center justify-center gap-2"
    >
      <div className="size-14 flex items-center justify-center border rounded-lg bg-secondary/25">
        <Icon className="size-4" />
      </div>
      <span className="text-xs">{label}</span>
    </button>
  );
};

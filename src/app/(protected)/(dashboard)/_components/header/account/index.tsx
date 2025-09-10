import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SettingsIcon, UserIcon } from "lucide-react";
import { LogOut } from "./log-out";
import { ThemeSwitcher } from "./theme-switcher";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export function Account() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-sm">
          <UserIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-5">
        <div className="flex items-center justify-between">
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <ThemeSwitcher />
        </div>
        <DropdownMenuSeparator />
        <Button
          variant="ghost"
          className="w-full flex items-center justify-start gap-2"
        >
          <SettingsIcon size="size-4" />
          Configurações
        </Button>
        <DropdownMenuSeparator />
        <LogOut />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import { LogOut } from "./log-out";
import { ThemeSwitcher } from "./theme-switcher";

export function Account() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <UserIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-5">
        <div className="flex items-center justify-between">
          <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
          <ThemeSwitcher />
        </div>
        <DropdownMenuSeparator />
        <LogOut />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

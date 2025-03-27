import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { Logotype } from "../../logotype";
import { Nav } from "./nav";

export function Menu() {
  return (
    <div className="flex items-center gap-5">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="lg:hidden">
            <MenuIcon className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetHeader>
          <SheetTitle />
          <SheetDescription />
        </SheetHeader>
        <SheetContent side="left">
          <div className="p-8 flex flex-col gap-8">
            <Logotype />
            <Nav orientation="vertical" />
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-8">
        <Logotype className="hidden lg:flex" />
        <Nav orientation="horizontal" className="hidden lg:flex" />
      </div>
    </div>
  );
}

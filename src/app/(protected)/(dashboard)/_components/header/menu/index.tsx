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
import { Logotype } from "../../../../_components/logotype";
import { Nav } from "./nav";
import { FC } from "react";

type MenuProps = {
  tenantId: string;
};

export const Menu: FC<MenuProps> = ({ tenantId }) => {
  return (
    <div className="flex items-center gap-5">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="hidden md:flex lg:hidden"
          >
            <MenuIcon className="size-4" />
          </Button>
        </SheetTrigger>
        <SheetHeader className="hidden md:flex lg:hidden">
          <SheetTitle />
          <SheetDescription />
        </SheetHeader>
        <SheetContent side="left">
          <div className="p-8 flex flex-col gap-8">
            <Logotype tenantId={tenantId} />
            <Nav orientation="vertical" tenantId={tenantId} />
          </div>
        </SheetContent>
      </Sheet>
      <Logotype className="flex md:hidden lg:flex" tenantId={tenantId} />
      <div className="flex items-center gap-8">
        <Nav
          orientation="horizontal"
          className="hidden lg:flex"
          tenantId={tenantId}
        />
      </div>
    </div>
  );
};

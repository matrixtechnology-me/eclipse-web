import { Account } from "./account";
import { Menu } from "./menu";
import { ModeToggle } from "./mode-toggle";

export const Header = () => {
  return (
    <div className="w-screen h-16 border-b px-5 lg:px-0">
      <div className="w-full h-full max-w-7xl mx-auto flex items-center justify-between">
        <Menu />
        <div className="flex gap-2">
          <ModeToggle />
          <Account />
        </div>
      </div>
    </div>
  );
};

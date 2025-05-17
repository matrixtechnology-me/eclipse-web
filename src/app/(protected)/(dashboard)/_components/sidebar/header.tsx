import { Logotype } from "@/app/(protected)/_components/logotype";

export const Header = () => {
  return (
    <div className="w-full h-16 border-b flex items-center justify-center">
      <Logotype className="flex md:hidden lg:flex" />
    </div>
  );
};

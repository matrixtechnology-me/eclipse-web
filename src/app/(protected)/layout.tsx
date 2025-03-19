import { FC } from "react";
import { getServerSession } from "../../lib/session";
import { redirect } from "next/navigation";
import { PATHS } from "@/config/paths";
import { Header } from "./_components/header";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: FC<LayoutProps> = async ({ children }) => {
  const session = await getServerSession();

  if (!session) redirect(PATHS.PUBLIC.AUTH.SIGN_IN);

  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Layout;

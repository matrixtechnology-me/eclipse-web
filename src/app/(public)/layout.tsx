import { FC } from "react";
import { getServerSession } from "../../lib/session";
import { redirect } from "next/navigation";
import { PATHS } from "@/config/paths";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: FC<LayoutProps> = async ({ children }) => {
  const session = await getServerSession();

  if (session) redirect(PATHS.PROTECTED.HOMEPAGE);

  return <>{children}</>;
};

export default Layout;

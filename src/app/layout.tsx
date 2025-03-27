import { ReactQueryProvider } from "@/providers/react-query";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eclipse - Gestão inteligente para negócios que crescem.",
  description: "Gestão inteligente para negócios que crescem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${spaceGrotesk.className} antialiased dark`}>
        <Suspense>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </Suspense>
      </body>
    </html>
  );
}

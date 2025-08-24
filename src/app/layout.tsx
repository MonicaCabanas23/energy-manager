import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Administrador de energía",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Circuitos", href: "/circuitos" }
  ]

  return (
    <html lang="es">
      <body>
        <Header 
          links={links}
        />
        <main className="bg-slate-100 max-w-screen" style={{ minHeight: "calc(100vh - 56px)" }}>
          {children}
        </main>
      </body>
    </html>
  );
}

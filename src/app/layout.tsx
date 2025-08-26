import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header/Header";
import { MdHome } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { PiCircuitryFill } from "react-icons/pi";

export const metadata: Metadata = {
  title: "Administrador de energía",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = [
    { label: "Home"      , href: "/"         , icon: <MdHome /> },
    { label: "Dashboard" , href: "/dashboard", icon: <MdDashboard /> },
    { label: "Circuitos" , href: "/circuitos", icon: <PiCircuitryFill /> }
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

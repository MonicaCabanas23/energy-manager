import "./globals.css";
import type { Metadata }   from "next";
import Header              from "@/components/layout/Header/Header";
import { MdHome }          from "react-icons/md";
import { MdDashboard }     from "react-icons/md";
import { PiCircuitryFill } from "react-icons/pi";
import { BiLogOut }        from "react-icons/bi";
import { SessionProvider } from "@/contexts/SessionContext";
import { auth0 }           from "@/lib/auth0";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

export const metadata: Metadata = {
  title: "Administrador de energía",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth0.getSession();

  

  const links = [
    { 
      code: 'home', 
      label: "Home", 
      href: "/", 
      icon: <MdHome />,
      showInHeader: true,
      showInSidebar: true,
      showInProfileMenu: false,
      anchorTag: false
    },
    { 
      code: 'dashboard',
      label: "Dashboard",
      href: "/dashboard",
      icon: <MdDashboard />,
      showInHeader: true,
      showInSidebar: true,
      showInProfileMenu: false,
      anchorTag: false
    },
    {
      code: 'circuitos',
      label: "Circuitos",
      href: "/circuitos",
      icon: <PiCircuitryFill />,
      showInHeader: true,
      showInSidebar: true,
      showInProfileMenu: false,
      anchorTag: false
    },
    {
      code: 'logout',
      label: "Cerrar sesión",
      href: "/auth/logout",
      icon: <BiLogOut />,
      classes: 'text-red-500',
      showInHeader: false,
      showInSidebar: true,
      showInProfileMenu: true,
      anchorTag: true
    },
  ]

  return (
    <html lang="es">
      <body>
        <SessionProvider value={session}>
          <Header 
            links={links}
          />
          <main className="bg-gray-100 max-w-screen" style={{ minHeight: "calc(100vh - 56px)" }}>
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}

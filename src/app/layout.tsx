import "./globals.css";
import type { Metadata }   from "next";
import Header              from "@/components/layout/Header/Header";
import { MdHome }          from "react-icons/md";
import { MdDashboard }     from "react-icons/md";
import { PiCircuitryFill } from "react-icons/pi";
import { BiLogOut }        from "react-icons/bi";
import { UserProvider }    from "@/contexts/UserContext";
import { auth0 }           from "@/lib/auth0";
import { syncUser }        from "@/lib/syncUser";

export const metadata: Metadata = {
  title: "Administrador de energía",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session     = await auth0.getSession();
  const dbUser      = session?.user ? syncUser(session.user) : null
  const sessionUser = session?.user ?? null

  const links = [
    { 
      code: 'home', 
      label: "Home", 
      href: "/", 
      icon: <MdHome />,
      visible: dbUser ? true : false,
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
      visible: dbUser ? true : false,
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
      visible: dbUser ? true : false,
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
      visible: dbUser ? true : false,
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
        <UserProvider value={sessionUser}>
          <Header 
            links={links}
          />
          <main className="bg-gray-100 max-w-screen" style={{ minHeight: "calc(100vh - 56px)" }}>
            {children}
          </main>
        </UserProvider>
      </body>
    </html>
  );
}

import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Fetch the user session
  const session = await auth0.getSession();

  const users = await prisma.user.findMany()

  // If session exists, show a welcome message and logout button
  return (
    <main>
      <h1>Welcome, {session?.user.name}!</h1>
      {
        users.map((user:any) => (<p key={user.id}>{user.name}</p>))
      }
    </main>
  );
}
import { auth0 } from "@/lib/auth0";

export default async function Home() {
  // Fetch the user session
  const session = await auth0.getSession();

  // If session exists, show a welcome message and logout button
  return (
    <main>
      <h1>Welcome, {session?.user.name}!</h1>
    </main>
  );
}
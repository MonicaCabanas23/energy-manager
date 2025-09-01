"use client"
import { SessionData } from "@auth0/nextjs-auth0/types";
import { createContext, useContext } from "react";

export const SessionContext = createContext<SessionData | null>(null);

export function SessionProvider({ value, children }: { value: SessionData | null; children: React.ReactNode }) {
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
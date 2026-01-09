"use client";

import { ReactNode } from "react";
import { useSession } from "next-auth/react";
import LoginPage from "./LoginPage";

interface ProtectedAppProps {
  children: ReactNode;
}

export default function ProtectedApp({ children }: ProtectedAppProps) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <LoginPage />;
  }

  return <>{children}</>;
}

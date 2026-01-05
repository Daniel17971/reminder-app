"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import LoginPage from "./LoginPage";

interface ProtectedAppProps {
  children: ReactNode;
}

export default function ProtectedApp({ children }: ProtectedAppProps) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
}

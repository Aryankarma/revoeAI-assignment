"use client";

import { useAuth } from "@/lib/useAuth";
import { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <div className="p-4">Loading...</div>;

  if (!isAuthenticated) return null;

  return <>{children}</>;
}

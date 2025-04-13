"use client";

import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  const { isAuthenticated, loading } = useAuth();

  // useEffect(() => {
  //   if (pathname === "/app/auth") {
  //     if (isAuthenticated) {
  //       router.replace("/app/dashboard");
  //     }
  //   } else {
  //     if (!isAuthenticated) {
  //       alert("not authenticated");
  //       router.replace("/");
  //     }
  //   }
  // }, [isAuthenticated, router]);

  // if (loading) {
  //   return <p>loading...</p>;
  // }

  return (
    <div className="mx-8">
      {children}
      </div>
  );
}

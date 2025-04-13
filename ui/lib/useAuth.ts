// hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth(redirect = true) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      // if (redirect) router.push("/app/auth");
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/validate-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem("token");
          if (redirect) router.push("/app/auth");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (redirect) router.push("/app/auth");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [router, redirect]);

  return { isAuthenticated, loading };
}

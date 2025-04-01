import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    console.log(isAuthenticated)
  },[isAuthenticated])

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (!token) {
      router.push("/login");
      return;
    }

    // Validate token with the backend
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
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem("token")
          router.push("/login")
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        router.push("/login");
      }
    };

    verifyToken();
  }, [router]);

  return { isAuthenticated };
}

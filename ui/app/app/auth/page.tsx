'use client'
import { AuthForm } from "@/components/auth-form"
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {

  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/app/dashboard")
    }
  }, [isAuthenticated, router]);

  
    if(loading){
      return <p>Loading...</p>
    }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm />
      </div>
    </div>
  )
}

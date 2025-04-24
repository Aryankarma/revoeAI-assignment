"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const mode = params.get("q");
    if (mode === "register") {
      setIsRegister(true);
    } else if (mode === "login") {
      setIsRegister(false);
    } else {
      console.log(params);
      router.push("/app/dashboard");
    }
  }, [params]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";

    try {
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, {
        name: isRegister ? name : undefined,
        email,
        password,
      });

      console.log("API response: ", data);
      localStorage.setItem("token", data.token);

      toast(isRegister ? "Registration Successful" : "Login Successful");

      setTimeout(() => {
        router.push("/app/dashboard");
      }, 100);
    } catch (error: any) {
      console.log("Authentication error", error);

      toast(`Authentication Failed: ${error?.response?.data?.message}`);
    }
  };

  const handleClick = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    router.replace(`/app/auth?q=${!isRegister ? "register" : "login"}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {isRegister ? "Register" : "Login"}
        </CardTitle>
        <CardDescription>
          {isRegister ? "Create an account" : "Great to see you again!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          {isRegister && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <Button type="submit" className="w-full">
            {isRegister ? "Register" : "Login"}
          </Button>
          <div className="mt-4 text-center text-sm">
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <span className="underline cursor-pointer">
              <a href="#" onClick={handleClick}>
                {isRegister ? "Login" : "Sign up"}
              </a>
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

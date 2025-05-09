"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
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

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

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
        router.push("/dashboard");
      }, 350);
    } catch (error: any) {
      console.log("Authentication error", error);

      toast(`Authentication Failed: ${error?.response?.data?.message}`);
    }
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
            <span
              className="underline cursor-pointer"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Login" : "Sign up"}
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import {useState} from "react"
import {useRouter} from 'next/navigation'
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/lib/useAuth";

export default function Home() {

  const router = useRouter();

  // for authentication
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null; // Prevents flickering

  return (  
    <div className="flex justify-center flex-col gap-3 text-center align-center min-w-screen min-h-screen">
      <div className="absolute top-5 right-5">
        <ModeToggle />
      </div>
      <h1>You're at the home page</h1>
      <Link className="hover:underline" href="/login"> Go To Login</Link>
    </div>
  );
}

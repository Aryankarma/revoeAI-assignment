"use client";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import {useState} from "react"
import {useRouter} from 'next/navigation'
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/lib/useAuth";

export default function Dashboard() {

  const router = useRouter();

  // for authentication
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return null

  return (  
    <div className="flex justify-center flex-col gap-3 text-center align-center min-w-screen min-h-screen">
      <h1>This is Dashboard</h1>
    </div>
  );
}
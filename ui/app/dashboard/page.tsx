"use client";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/lib/useAuth";
import type { Metadata } from "next";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableList } from "@/components/table-list";
import axios from "axios";

export default function Dashboard() {
  const router = useRouter();

  // for authentication
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex gap-2">

          <Link href="/create-table">
            <Button variant={"outline"}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Table
            </Button>
          </Link>
          <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="py-4">
          <div className="grid gap-6">
            <TableList />
          </div>
        </div>
      </main>
    </div>
  );
}

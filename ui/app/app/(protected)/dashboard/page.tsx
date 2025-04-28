"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/lib/useAuth";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableList } from "@/components/table-list";
import { UserDropdown } from "@/components/ui/userDropdown";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useTheme } from "next-themes";
import axios from "axios";
import { toast } from "sonner";
import { useDashboardConfig } from "@/store/appStore";

const data = {
  user: {
    name: "Aryan Karma",
    email: "aryankarma29@gmail.com",
    avatar: "/avatar.jpg",
  },
};

export default function Dashboard() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { dashboardConfig, setDashboardConfig } = useDashboardConfig();
  

  // for authentication
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("use effect");

    const getDashboardConfig = async () => {
      try {
        const dashoboardConfig: any = await axios.get(
          "http://localhost:5000/api/user/getDashboardConfig",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (dashoboardConfig?.data?.success) {
          console.log(dashoboardConfig.data);
          setDashboardConfig(dashoboardConfig.data);
        } else {
          toast("Error fetching Dashboard Config.");
        }
      } catch (error) {
        toast("Error fetching Dashboard Config, check console.");
        console.log("There was some error fetching dashboard configs: ", error);
      }
    };

    getDashboardConfig();
  }, []);

  // if (loading) {
  //   return <p>loading...</p>;
  // }

  if (!isAuthenticated) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // onSearch(value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center justify-between">
          <h1 className="text-xl mr-24 font-semibold">Dashboard</h1>
          {dashboardConfig?.isPro ? (
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={"Search sheets"}
                className="pl-10"
                value={query}
                onChange={handleInputChange}
              />
            </div>
          ) : null}

          <div className="flex gap-3">
            <Link href="/app/create-table">
              <Button variant={"outline"}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Table
              </Button>
            </Link>
            <ModeToggle />
            <UserDropdown
              user={
                dashboardConfig
                  ? {
                      name: dashboardConfig.userData.name,
                      email: dashboardConfig.userData.email,
                      avatar: "./avatar.jpg",
                    }
                  : null
              }
            />
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

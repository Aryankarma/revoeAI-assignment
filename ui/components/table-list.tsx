"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, RefreshCw, Plus } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { mockFetchTables } from "@/lib/mock-data";
import type { TableDashboard } from "@/lib/types";
import { MagicCard } from "./magicui/magic-card";

export function TableList() {
  const [tables, setTables] = useState<TableDashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  const loadAllTables = async () => {
    setLoading(true);
    setRefreshing(true);

    try {
      const token = localStorage.getItem("token"); // Retrieve auth token
      if (!token) throw new Error("No auth token found");

      const res = await axios.get(
        "http://localhost:5000/api/sheet/getAllTables",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("fetched tables data from new api - ", res.data);

      if (res.data.success) {
        setTables(res.data.tables);
      } else {
        console.error("Failed to fetch tables:", res.data.message);
      }
    } catch (error) {
      console.error("Error fetching tables:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      loadAllTables();
    }, 1000);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAllTables();
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-10 text-center">
        <CardHeader>
          <CardTitle>No Tables Found</CardTitle>
          <CardDescription>
            Create your first table to get started
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/create-table">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Table
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium">Your Tables</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tables.map((table) => (
          <Card
            className="border-none outline-none cursor-default transition-all"
            key={table.id}
          >
            <MagicCard>
              <CardHeader>
                <CardTitle>{table.name}</CardTitle>
                <CardDescription>
                  {table.columnCount} columns • Last updated:{" "}
                  {new Date(table.updatedAt).toLocaleString().slice(0, 17)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>Connected to Google Sheet</p>
                  <p className="mt-1 truncate">{table.googleSheetUrl}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/tables/${table.id}`} className="w-full">
                  <Button className="w-full">
                    View Table
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </MagicCard>
          </Card>
        ))}
      </div>
    </div>
  );
}

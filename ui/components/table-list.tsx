"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  RefreshCw,
  Plus,
  Pencil,
  Trash,
  LoaderCircle,
} from "lucide-react";
import axios, { AxiosResponse } from "axios";
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
import type { TableDashboard } from "@/lib/types";
import { MagicCard } from "./magicui/magic-card";
import { toast } from "sonner";
import { NODE_ESM_RESOLVE_OPTIONS } from "next/dist/build/webpack-config";
import { useTableManager } from "@/store/appStore";

export function TableList() {
  const { tables, setTables, loading, setLoading, refreshing, setRefreshing, deletedTableID, setDeletedTableID } =
    useTableManager();

  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [deletingTable, setDeletingTable] = useState<string | null>(null);

  const loadAllTables = async () => {
    setLoading(true);
    setRefreshing(true);

    try {
      const token = localStorage.getItem("token");
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

  const handleBlurOrEnter = async (tableId: string) => {
    if (
      !editedName.trim() ||
      editedName.trim() ==
        tables.filter((table) => table.id == tableId)[0].name.trim()
    ) {
      setEditingTable(null);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      await axios.put(
        `http://localhost:5000/api/sheet/updateTableName/${tableId}`,
        { name: editedName },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingTable(null);
      handleRefresh(); // Refresh the table list
    } catch (error) {
      console.error("Error updating table name:", error);
    }
  };

  // when we delete a table, just remove the table by tableid from the all tables state management, don't refresh the page and fetch all tables...
  const handleDeleteTable = async (tableId: string) => {
    setDeletingTable(tableId);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");
      console.log(`http://localhost:5000/api/sheet/deleteTable/${tableId}`);

      const res: any = await axios.delete(
        `http://localhost:5000/api/sheet/deleteTable/${tableId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("delete table response: ", res);

      if (res.data.success) {
        toast("Table deleted successfully.");
        setDeletedTableID(tableId)
        handleRefresh();
      } else {
        toast("Error while deleting table.");
      }
    } catch (error) {
      console.error("Error deleting table:", error);
      toast("An error occured while deleting table.");
    } finally {
      setDeletingTable(null);
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

  const handleEditClick = (tableId: string, currentName: string) => {
    setEditingTable(tableId);
    setEditedName(currentName);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-6 w-full" />
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
          <Link href="/app/create-table">
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
                {editingTable === table.id ? (
                  <input
                    type="text"
                    value={editedName}
                    autoFocus
                    onChange={handleNameChange}
                    onBlur={() => handleBlurOrEnter(table.id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleBlurOrEnter(table.id)
                    }
                    className="w-full bg-transparent rounded-md focus:outline-none focus:ring-0 focus:ring-none"
                  />
                ) : (
                  <CardTitle
                    onClick={() => handleEditClick(table.id, table.name)}
                    className="hover:cursor-text p-1 pl-0"
                  >
                    {table.name}
                  </CardTitle>
                )}
                <CardDescription>
                  {table.columnCount} columns • Last updated:{" "}
                  {new Date(table.updatedAt).toLocaleString().slice(0, 17)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>Connected to Google Sheet</p>
                  <a
                    href={table.googleSheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 truncate hover:underline"
                  >
                    {table.googleSheetUrl.slice(0, 45) + "..."}
                  </a>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Link href={`/app/tables/${table.id}`} className="w-full">
                  <Button className="w-full" variant="outline">
                    View Table
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <div className="flex gap-2 ml-2">
                  {/* <Button className="p-3" variant="secondary">
                    <Pencil className="h-4 w-4" />
                  </Button> */}
                  <Button
                    onClick={() => handleDeleteTable(table.id)}
                    variant="destructive"
                    className="p-3"
                  >
                    {deletingTable == table.id ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardFooter>
            </MagicCard>
          </Card>
        ))}
      </div>
    </div>
  );
}

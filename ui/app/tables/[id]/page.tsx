"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TableView } from "@/components/table-view";
import { getSheetDataFromGoogleAPI, saveDataInDB } from "@/lib/sheetRefresh";
import type { TableData, Table, Row, Column } from "@/lib/types";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


export default function TablePage({
  params: promiseParams,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(promiseParams);
  const router = useRouter();
  const [table, setTable] = useState<Table | null>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncOn, setSyncOn] = useState(false);
  const [editingTable, setEditingTable] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");

  useEffect(() => {
    loadTableById();
  }, [params.id]);

  const loadTableById = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No Auth token found!");

      const response = await axios.get(
        `http://localhost:5000/api/sheet/getTableById/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("fetched table by id: ", response.data);

      if (response.data.success) {
        setTable(response.data.tables[0]);
        const tableData = {
          rows: [...response.data.tables[0].rows],
          lastUpdated: response.data.tables[0].updatedAt,
        };
        setTableData(tableData);
      } else {
        console.error("Failed to fetch table: ", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching tables: ", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleEditClick = (tableId: string, currentName: string) => {
    setEditingTable(tableId);
    setEditedName(currentName);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleBlurOrEnter = async (tableId: string) => {
    if (
      !editedName.trim() || editedName.trim() == table?.name ) {
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
      loadTableById()
    } catch (error) {
      console.error("Error updating table name:", error);
    }
  };

  // Compares two arrays of objects to determine if they contain the same key-value pairs, ignoring the _id field if present.
  function areObjectsEqualIgnoringId(arr1: any, arr2: any) {
    if (arr1?.length !== arr2?.length) return false;

    return arr1.every((item1: { [x: string]: any; _id: any }) =>
      arr2.some((item2: { [x: string]: any; _id: any }) => {
        const { _id: _, ...filteredItem1 } = item1;
        const { _id: __, ...filteredItem2 } = item2;
        return JSON.stringify(filteredItem1) === JSON.stringify(filteredItem2);
      })
    );
  }

  const handleRefresh = async () => {
    if (refreshing) return;

    setRefreshing(true);
    console.log("table?.googleSheetUrl: ", table?.googleSheetUrl, table?.name);

    const response = await getSheetDataFromGoogleAPI(
      table?.googleSheetUrl,
      table?.name
    );

    console.log("data from google sheet api: ", response);
    console.log("data we already had: ", table);

    if (
      areObjectsEqualIgnoringId(table?.rows, response?.rows) && // table data is old, response data is newly fetched from google sheets api
      areObjectsEqualIgnoringId(table?.columns, response?.columns)
    ) {
      !syncOn
        ? toast("No new changes detected. Data is already up-to-date.")
        : null;
    } else {
      const savingDatainDbresponse = await saveDataInDB(response, params.id);

      setTable(savingDatainDbresponse);
      const tableData = {
        rows: [...savingDatainDbresponse.rows],
        lastUpdated: savingDatainDbresponse.updatedAt,
      };
      setTableData(tableData);

      toast("Data successfully updated from Google Sheets.");
    }

    setRefreshing(false);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const refreshLoop = async () => {
      if (!table?.googleSheetUrl) return;

      await handleRefresh();
      timeoutId = setTimeout(refreshLoop, 15000);
    };

    if (table?.googleSheetUrl && syncOn) {
      refreshLoop();
    }

    return () => clearTimeout(timeoutId);
  }, [table?.googleSheetUrl, syncOn]);

  return (
    <div className="py-4">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="flex gap-3 flex-row-reverse">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw
              className={`mr-1 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh Data
          </Button>
          <div className="flex items-center space-x-2">
            <Switch
              id="Auto-Sync"
              checked={syncOn}
              onCheckedChange={(checked) => setSyncOn(checked)}
            />
            <Label className="cursor-pointer text-xs px-1" htmlFor="Auto-Sync">
              Auto Sync
            </Label>
          </div>
        </div>
      </div>

      {loading ? (
        <Card className="p-6">
          <Skeleton className="h-8 w-1/3 mb-6" />
          <Skeleton className="h-[400px] w-full" />
        </Card>
      ) : table && tableData ? (
        <>
          {/* <h1 className="text-2xl font-bold mb-2">{table.name}</h1> */}
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
              className="w-full bg-transparent text-2xl font-bold mb-2 rounded-md focus:outline-none focus:ring-0 focus:ring-none"
            />
          ) : (
            <h1
              onClick={() => handleEditClick(table.id, table.name)}
              className="text-2xl font-bold mb-2"
            >
              {table.name}
            </h1>
          )}
          <p className="text-muted-foreground mb-6">
            Connected to{" "}
            <a
              href={table.googleSheetUrl}
              target="_blank"
              className="hover:underline"
              rel="noopener noreferrer"
            >
              Google Sheet
            </a>{" "}
            • Last updated:{" "}
            {new Date(table.updatedAt).toLocaleString().slice(0, 17)}
          </p>
          <p className="text-muted-foreground mb-6">{table.description}</p>
          <TableView table={table} data={tableData} />
        </>
      ) : (
        <Card className="p-6 text-center">
          <p>Table not found or error loading data</p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Return to Dashboard
          </Button>
        </Card>
      )}
    </div>
  );
}

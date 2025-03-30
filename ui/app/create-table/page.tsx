"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { SheetData, Column, Row } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockCreateTable } from "@/lib/mock-data";
import axios from "axios";
import { toast } from "sonner";

export default function CreateTablePage() {
  const router = useRouter();
  const [columns, setColumns] = useState<Column[]>([]);
  const [sheetUrl, setSheetUrl] = useState<string>("");
  const [tableName, setTableName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState([]);
  const [range, setRange] = useState("Sheet1!A1:D10");
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const addColumn = () => {
    setColumns([
      ...columns,
      { name: `Column ${columns.length + 1}`, type: "text" },
    ]);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const updateColumn = (index: number, field: keyof Column, value: string) => {
    setColumns(
      columns.map((col, i) => (i === index ? { ...col, [field]: value } : col))
    );
  };

  useEffect(()=>{
  },[columns])

  const handleSubmitOld = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await mockCreateTable({
        name: tableName,
        googleSheetUrl: sheetUrl,
        columns,
      });

      // Simulate API delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error creating table:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!sheetUrl) {
      alert("Please enter a valid Google Sheets URL");
      return;
    }
  
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get(
        "http://localhost:5000/api/sheet/getSheet",
        {
          params: {
            sheetUrl: sheetUrl,
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );


      if (response.data.error) throw new Error(response.data.error);

      setData(response.data.values);
      const transformedData = transformSheetData(response.data)

      const tableData = {
        name: tableName,
        googleSheetUrl: sheetUrl,
        columns: [...transformedData.columns, ...columns],
        rows: transformedData.rows,
        // The following fields will be added by MongoDB automatically with timestamps: true
        // createdAt: new Date(),
        // updatedAt: new Date(),
        // lastUpdated: new Date()
      };

      console.log("consoloin sjee response")
      console.log(response.data.values)

      const saveResponse = await axios.post(
        "http://localhost:5000/api/sheet/createSheet",
        tableData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

    
      // Check if save was successful
      if (saveResponse.data.success) {
        // Redirect to dashboard
        toast("Table created successfully.")
        setTimeout(()=>{
          router.push("/dashboard");
        }, 750)
      } else {
        toast("Error creatin table")
        alert("Error creating table: " + saveResponse.data.message);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }finally {
      setIsSubmitting(false);
    }
  };

  function transformSheetData(sheetData: SheetData): {
    columns: Column[];
    rows: Row[];
  } {

    
    if (!sheetData || !sheetData.values || sheetData.values.length === 0) {
      return { columns: [], rows: [] };
    }

    const headers: string[] = sheetData.values[0]; // First row as column names
    const rowsData: string[][] = sheetData.values.slice(1); // Remaining rows as data

    // Generate columns array
    const columns: Column[] = headers.map((header) => ({
      name: header.trim(), // Trim whitespace
      type: "text", // Default type (you can change based on logic)
    }));

    // Generate rows array
    const rows: Row[] = rowsData.map((row) => {
      let obj: Row = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = row[index] || ""; // Handle missing values
      });
      return obj;
    });

    return { columns, rows };
  }

  return (
    <div className="py-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <Card className="mx-auto max-w-3xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Create New Table</CardTitle>
            <CardDescription>
              Define your table structure and connect it to a Google Sheet
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="table-name">Table Name</Label>
              <Input
                id="table-name"
                placeholder="Enter table name"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sheet-url">Google Sheet URL</Label>
              <Input
                id="sheet-url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Make sure your Google Sheet is public, <a className="underline" href="http://">See how to make it public.</a>
              </p>
            </div>
            {/* Add columns */}
            {/* <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Columns</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addColumn}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Column
                </Button>
              </div>
              <div className="space-y-4">
                {columns.map((column, index) => (
                  <div key={index} className="flex items-end gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`column-name-${index}`}>
                        Column Name
                      </Label>
                      <Input
                        id={`column-name-${index}`}
                        placeholder="Column Name"
                        value={column.name}
                        onChange={(e) =>
                          updateColumn(index, "name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="w-[180px] space-y-2">
                      <Label htmlFor={`column-type-${index}`}>Data Type</Label>
                      <Select
                        value={column.type}
                        onValueChange={(value) =>
                          updateColumn(index, "type", value)
                        }
                      >
                        <SelectTrigger id={`column-type-${index}`}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeColumn(index)}
                      disabled={columns.length === 0}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove column</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div> */}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Table"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

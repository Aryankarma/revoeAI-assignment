"use client";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/lib/useAuth";
import axios from "axios";

type SheetData = {
  values: string[][];
};

type Column = {
  name: string;
  type: "text" | "number" | "date";
};

type Row = Record<string, string>;

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [data, setData] = useState([]);
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const [range, setRange] = useState("Sheet1!A1:D10");
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isClient) {
      const sheetURL = prompt("Enter a sheet URL");
      if (sheetURL) {
        setSheetUrl(sheetURL);
      }
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient && sheetUrl) {
      fetchData();
    }
  }, [sheetUrl, isClient]);

  const fetchData = async () => {
    if (!sheetUrl) {
      alert("Please enter a valid Google Sheets URL");
      return;
    }

    try {        
      const response = await axios.get(
        "http://localhost:5000/api/sheet/getSheet",
        {
          params: {
            sheetUrl: sheetUrl,
          },
        }
      );

      console.log(response)

      if (response.data.error) throw new Error(response.data.error);

      setData(response.data.values);
      const transformedData = transformSheetData(response.data)
      console.log(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

function transformSheetData(sheetData: SheetData): { columns: Column[]; rows: Row[] } {
  console.log("sheetData : ", sheetData)
    if (!sheetData || !sheetData.values || sheetData.values.length === 0) {
      console.log("funciton not working")
        return { columns: [], rows: [] };
    }

    const headers: string[] = sheetData.values[0]; // First row as column names
    const rowsData: string[][] = sheetData.values.slice(1); // Remaining rows as data

    // Generate columns array
    const columns: Column[] = headers.map(header => ({
        name: header.trim(), // Trim whitespace
        type: "text" // Default type (you can change based on logic)
    }));

    // Generate rows array
    const rows: Row[] = rowsData.map(row => {
        let obj: Row = {};
        headers.forEach((header, index) => {
            obj[header.trim()] = row[index] || ""; // Handle missing values
        });
        return obj;
    });

    return { columns, rows };
}


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center flex-col gap-3 text-center align-center min-w-screen min-h-screen">
      <h1>You're at the home page</h1>
      <Link className="hover:underline" href="/login">
        Go To Login
      </Link>
    </div>
  );
}

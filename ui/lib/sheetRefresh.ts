import axios from "axios";
import router from "next/router";
import { toast } from "sonner";
import { Column, Row, SheetData } from "./types";

// what do we need to do ro refresh data ->
// run api 1 send the sheet url,
// transform the data
// check if the data is different when comparing to current data
// if yes send the data to the db and fetch again or abort

const getSheetDataFromGoogleAPI = async (sheetUrl: string | undefined, tableName: string | undefined) => {
  if (!sheetUrl) {
    alert("Please enter a valid Google Sheets URL");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    // gets sheet data from google api
    const response = await axios.get(
      "http://localhost:5000/api/sheet/getSheet",
      {
        params: {
          sheetUrl: sheetUrl,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.error) throw new Error(response.data.error);

    const tableDataResponse = response.data.values;
    console.log("api 1 : ", tableDataResponse);

    const transformedData = transformSheetData(response.data);

    const tableData = {
      name: tableName,
      googleSheetUrl: sheetUrl,
      columns: transformedData.columns,
      rows: transformedData.rows,
    };

    // Check if save was successful
    if (tableData) {
      return tableData
    } else {
      toast("Error fetching table");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

// once this is done, refresh table data on the page
const saveDataInDB = async (tableData: any, tableId: string) => {
  if (!tableData) {
    alert("No data to save");
    return;
  }

  console.log("Data recieved in db function: ", tableData);
  console.log("Table ID: ", tableId);

  const token = localStorage.getItem("token");
  
  try {
    // saves sheet data in mongodb
    const saveResponse = await axios.put(
      "http://localhost:5000/api/sheet/updateSheet",
      {tableData: tableData, tableId: tableId},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check if save was successful
    if (saveResponse.data.success) {
      // Redirect to dashboard
      return saveResponse.data.table;
    } else {
      toast("Error updating table");
      alert("Error updating table: " + saveResponse.data.message)
    }
  } catch (error) {
    console.error("Error fetching data:", error)
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

export { getSheetDataFromGoogleAPI, saveDataInDB };

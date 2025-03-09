"use server"

import { revalidatePath } from "next/cache"
import { google } from "googleapis"
import type { Column, Table, TableData } from "./types"

// Mock database for demo purposesg
const tables: Table[] = []
const tableData: Record<string, TableData> = {}

// Initialize Google Sheets API
async function getGoogleSheetsClient() {
  // In a real application, you would use environment variables for these credentials
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  })

  const sheets = google.sheets({ version: "v4", auth })
  return sheets
}

// Extract sheet ID from Google Sheets URL
function getSheetIdFromUrl(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/)
  if (!match) throw new Error("Invalid Google Sheet URL")
  return match[1]
}

export async function createTable(tableData: {
  name: string
  googleSheetUrl: string
  columns: Column[]
}) {
  try {
    // Validate the Google Sheet URL and check access
    const sheetId = getSheetIdFromUrl(tableData.googleSheetUrl)
    const sheets = await getGoogleSheetsClient()

    // Check if we can access the sheet
    await sheets.spreadsheets.get({
      spreadsheetId: sheetId,
    })

    // Create a new table
    const newTable: Table = {
      id: Date.now().toString(),
      name: tableData.name,
      googleSheetUrl: tableData.googleSheetUrl,
      columns: tableData.columns,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    tables.push(newTable)

    // Fetch initial data
    await fetchAndStoreSheetData(newTable)

    revalidatePath("/")
    return newTable
  } catch (error) {
    console.error("Error creating table:", error)
    throw new Error("Failed to create table. Please check the Google Sheet URL and permissions.")
  }
}

export async function fetchTables(): Promise<Table[]> {
  // In a real app, you would fetch from a database
  return tables
}

export async function fetchTableDetails(id: string): Promise<Table> {
  const table = tables.find((t) => t.id === id)
  if (!table) throw new Error("Table not found")
  return table
}

export async function fetchTableData(id: string): Promise<TableData> {
  // Check if we have cached data
  if (tableData[id]) {
    return tableData[id]
  }

  // If not, fetch from Google Sheets
  const table = tables.find((t) => t.id === id)
  if (!table) throw new Error("Table not found")

  return await fetchAndStoreSheetData(table)
}

async function fetchAndStoreSheetData(table: Table): Promise<TableData> {
  try {
    const sheets = await getGoogleSheetsClient()
    const sheetId = getSheetIdFromUrl(table.googleSheetUrl)

    // Fetch the first sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1", // You might want to make this configurable
    })

    const rows = response.data.values || []

    // Process the data
    const headers = rows[0] || []
    const data: Record<string, any>[] = []

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const rowData: Record<string, any> = {}

      for (let j = 0; j < headers.length; j++) {
        const header = headers[j]
        const column = table.columns.find((c) => c.name === header)

        if (column) {
          // Convert value based on column type
          let value = row[j] || ""

          if (column.type === "date" && value) {
            // Try to parse as date
            try {
              const date = new Date(value)
              if (!isNaN(date.getTime())) {
                value = date.toISOString()
              }
            } catch (e) {
              // Keep as string if parsing fails
            }
          } else if (column.type === "number" && value) {
            value = Number.parseFloat(value)
            if (isNaN(value)) value = 0
          }

          rowData[header] = value
        }
      }

      data.push(rowData)
    }

    const newData: TableData = {
      rows: data,
      lastUpdated: new Date().toISOString(),
    }

    // Store in our cache
    tableData[table.id] = newData

    return newData
  } catch (error) {
    console.error("Error fetching sheet data:", error)
    throw new Error("Failed to fetch data from Google Sheet")
  }
}


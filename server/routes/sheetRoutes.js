import { Router } from "express";
import Table from "../models/Table.js";
import protect from "../middleware/authMiddleware.js"; // auth midleware

const router = Router();
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY;

// Function to extract spreadsheetId from the URL
function extractSheetId(sheetUrl) {
  const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

// Fetch sheet metadata to get the first sheet name
async function getFirstSheetName(sheetId) {
  const metadataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${API_KEY}`;
  // https://sheets.googleapis.com/v4/spreadsheets/1wfGD28enZhZCukk2L-U5AO-S7NL3X78pPHzvucQydF8?key=AIzaSyC6vndGRo2950CpUp5u52S3kj-NQz64MDc
  const response = await fetch(metadataUrl);
  const data = await response.json();

  if (data.error) throw new Error(data.error.message);

  return data.sheets.length > 0 ? data.sheets[0].properties.title : null;
}

// create sheets with the user id
router.post("/createSheet", protect, async (req, res) => {
  try {
    const { name, googleSheetUrl, columns, rows } = req.body;

    console.log("running create sheet function");
    // console.log(name, googleSheetUrl, columns, rows)

    // creating new table wihle adding current user id
    const newTable = new Table({
      name,
      googleSheetUrl,
      columns,
      rows,
      user: req.user,
      lastUpdated: new Date(),
    });

    // console.log("created table: ", newTable)

    await newTable.save();

    console.log("table saved in db");

    res.status(200).json({
      success: true,
      table: {
        id: newTable._id,
        name: newTable.name,
        createdAt: newTable.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating table: ", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create table",
    });
  }
});

// get all the sheets the user has created
router.get("/getAllTables", protect, async (req, res) => {
  try {
    
    console.log("getting all sheets...");

    const tablesDashboard = await Table.find({ user: req.user})
      .select("_id name googleSheetUrl columns lastUpdated")
      .lean();

    const tableDataDashboard = tablesDashboard.map((table) => ({
      id: table._id,
      name: table.name,
      googleSheetUrl: table.googleSheetUrl,
      columnCount: table.columns.length,
      updatedAt: table.lastUpdated,
    }));

    res.json({
      success: true,
      tables: tableDataDashboard,
    });

  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tables",
    });
  }
});


router.get("/getTableById/:id", protect, async (req, res)=>{

  try{
    console.log("getting table by id: ", req.params.id)
    
    const tablesDetails = await Table.find({user: req.user, _id: req.params.id})
      .select("_id name googleSheetUrl columns rows lastUpdated createdAt")
    
    const tableDataDetails = tablesDetails.map((table)=>({
      id: table._id,
      name: table.name,
      googleSheetUrl: table.googleSheetUrl,
      rows: table.rows,
      columns: table.columns,
      updatedAt: table.lastUpdated,
      createdAt: table.createdAt
    }))  

    res.status(200).json({
      success:true,
      tables: tableDataDetails
    })


  }catch(error){
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch tables",
    })
  }

})






// API route to get sheet data
router.get("/getSheet", async (req, res) => {
  const { sheetUrl } = req.query;

  if (!sheetUrl) {
    return res.status(400).json({ error: "Missing sheetUrl" });
  }

  const sheetId = extractSheetId(sheetUrl);
  if (!sheetId) {
    return res.status(400).json({ error: "Invalid Google Sheets URL" });
  }

  try {
    // Get first sheet name from metadata
    const sheetName = await getFirstSheetName(sheetId);
    if (!sheetName) {
      return res
        .status(404)
        .json({ error: "No sheets found in the spreadsheet" });
    }

    // Fetch full sheet data
    const valuesUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      sheetName
    )}?key=${API_KEY}`;

    const response = await fetch(valuesUrl);
    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

export default router;

import mongoose from "mongoose";
import { configDotenv } from "dotenv";

configDotenv();

// MongoDB connection
console.log("MongoDB URI:", process.env.MONGO_URI);

const columnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
});

const rowSchema = new mongoose.Schema({}, { strict: false });

const tableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    googleSheetUrl: {
      type: String,
      required: true,
    },
    columns: [columnSchema],
    rows: [rowSchema], // Flexible schema for rows
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// adding last updated at field
tableSchema.add({   
    lastUpdated: {
        type: Date,
        default: Date.now()
    }
})

const Table = mongoose.model("Table", tableSchema)

export default Table;
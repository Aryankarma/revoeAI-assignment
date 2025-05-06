// open telementry
// import "./tracer.js"

import express, { json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import sheetRoutes from "./routes/sheetRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import protect from "./middleware/authMiddleware.js";
import bodyParser from "body-parser";

config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log(process.env.MONGO_URI);

// Middleware
app.use(cors());


// setting up wbehook for razorpay
app.use(
  "/api/webhooks",
  bodyParser.raw({ type: "application/json" }),
  (req, res, next) => {
    console.log("inside webhook middleware function in the main server");
    req.rawBody = req.body;
    next();
  }
);


// Increase JSON payload limit (default - 100kb)
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));

// MongoDB connection
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error);
  });

// Test route
app.get("/", (req, res) => {
  res.send("API is running on aws elastic beanstalk");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/auth", authRoutes);
app.use("/api/sheet", protect, sheetRoutes);
app.use("/api/payment", protect, paymentRoutes);
app.use("/api/user", protect, userRoutes);
app.use("/api/webhooks", webhookRoutes);

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

config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log(process.env.MONGO_URI);

// Middleware
app.use(cors());


// Add the raw body parser middleware for webhooks
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhooks/razorpay') {
    let data = '';
    req.on('data', chunk => {
      data += chunk.toString();
    });
    req.on('end', () => {
      req.rawBody = data;
      req.body = JSON.parse(data);
      next();
    });
  } else {
    next();
  }
});



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

// setting up wbehook for razorpay
app.use(
  "/webhooks/razorpay",
  bodyParser.raw({ type: "application/json" }),
  (req, res, next) => {
    req.rawBody = req.body;
    next();
  },
  bodyParser.json()
);

// Webhook endpoint
app.post("/webhooks/razorpay", async (req, res) => {
  try {
    // Verify webhook signature (see next step)
    const isValidSignature = verifyWebhookSignature(req)

    if (!isValidSignature) {
      return res.status(400).send({ error: "Invalid signature" })
    }

    // Process the webhook event (see step 3)
    await processWebhookEvent(req.body)

    // Return a 200 response quickly
    res.status(200).send({ status: "received" })
  } catch (error) {
    console.error("Webhook error:", error)
    // Still return 200 so Razorpay doesn't retry
    res.status(200).send({ status: "error handled" })
  }
})

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/auth", authRoutes);
app.use("/api/sheet", protect, sheetRoutes);
app.use("/api/payment", protect, paymentRoutes);
app.use("/api/user", protect, userRoutes);
app.use('/api/webhooks', webhookRoutes);
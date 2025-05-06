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

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs per IP
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Security middleware
app.use(helmet()); // Adds various HTTP security headers

// Cookies parsing for auth tokens
app.use(cookieParser());

console.log(process.env.MONGO_URI);

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

// Logging in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"cd
        ? process.env.FRONTEND_URL // Restrict to your frontend in production
        : true, // Allow all origins in development
    credentials: true, // Allow cookies to be sent/received
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);

// Apply rate limiting to all requests
app.use(globalLimiter);

// HTTPS redirect in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}

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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Server error",
    error: process.env.NODE_ENV !== "production" ? err.message : undefined,
  });
});

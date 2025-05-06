import mongoose from "mongoose";
import pkg from "bcryptjs";
const { genSalt, hash } = pkg;
import { configDotenv } from "dotenv";
configDotenv();

// MongoDB connection
console.log("MongoDB URI:", process.env.MONGO_URI);
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MongoDB URI is not defined in environment variables.");
  process.exit(1);
}

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected");
  });

// Define refresh token schema
const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 24 * 60 * 60 // 30 days in seconds (auto cleanup)
  }
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // New fields for email verification
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
    // New fields for password reset
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    // Track refresh tokens for session management
    refreshTokens: [refreshTokenSchema],
    // Last login information
    lastLogin: {
      timestamp: Date,
      ip: String,
      userAgent: String,
    },
    // Failed login attempts for additional security
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLocked: {
      type: Boolean,
      default: false,
    },
    accountLockedUntil: Date,
    currentPlan: {
      name: {
        type: String,
        enum: ["free", "pro"],
        default: "free",
      },
      isPaid: {
        type: Boolean,
        default: false,
      },
      subscriptionId: {
        type: String,
        default: null,
      },
      // don't check the status if it's a free plan (i.e. paid plan is false), status is for paid plans only
      subscriptionStatus: {
        type: String,
        enum: ["active", "cancelled", "expired"],
        default: "expired",
      },
      startedAt: {
        type: Date,
        default: null,
      },
      expiresAt: {
        type: Date,
        default: null,
      },
    },
    subscriptionHistory: [
      {
        subscriptionId: { type: String, default: null },
        name: { type: String, enum: ["free", "pro"], default: "free" },
        isPaid: { type: Boolean, default: false },
        status: {
          type: String,
          enum: ["active", "cancelled", "expired"],
          default: "expired",
        },
        startedAt: { type: Date, default: null },
        expiresAt: { type: Date, default: null },
        paymentDate: { type: Date, default: null },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if account is locked
userSchema.methods.isAccountLocked = function() {
  if (!this.accountLocked) return false;
  if (this.accountLockedUntil && this.accountLockedUntil < new Date()) {
    // Auto unlock if lock period has passed
    this.accountLocked = false;
    this.accountLockedUntil = null;
    this.failedLoginAttempts = 0;
    return false;
  }
  return this.accountLocked;
};

// Method to handle failed login attempts
userSchema.methods.registerLoginFailure = async function() {
  this.failedLoginAttempts += 1;
  // Lock account after 5 failed attempts
  if (this.failedLoginAttempts >= 5) {
    this.accountLocked = true;
    // Lock for 30 minutes
    this.accountLockedUntil = new Date(Date.now() + 30 * 60 * 1000);
  }
  await this.save();
};

// Method to register successful login
userSchema.methods.registerLoginSuccess = async function(ip, userAgent) {
  this.lastLogin = {
    timestamp: new Date(),
    ip,
    userAgent
  };
  this.failedLoginAttempts = 0;
  this.accountLocked = false;
  this.accountLockedUntil = null;
  await this.save();
};

const User = mongoose.model("User", userSchema);
export default User;
import mongoose from "mongoose";
import pkg from "bcryptjs";
const { genSalt, hash } = pkg;
import { configDotenv } from "dotenv";

configDotenv()

// MongoDB connection
console.log("MongoDB URI:", process.env.MONGO_URI);

const uri = process.env.MONGO_URI;
if (!uri) {
    console.error("MongoDB URI is not defined in environment variables.");
    process.exit(1);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log("Connected");
});

const userSchema = new mongoose.Schema({
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
});

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

const User = mongoose.model("User", userSchema);

export default User;

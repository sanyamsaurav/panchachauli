import mongoose from "mongoose";
import dns from "dns";

/**
 * ⭐ IMPORTANT FIX
 * Prevent MongoDB Atlas SRV DNS error on Windows / Node
 */
dns.setDefaultResultOrder("ipv4first");

/**
 * Use ENV variable
 */
const MONGODB_URI = process.env.MONGODB_URI as string;
// console.log(MONGODB_URI,"MONGODB_URIMONGODB_URIMONGODB_URI")
if (!MONGODB_URI) {
  throw new Error(
    "❌ Please define the MONGODB_URI environment variable inside .env.local"
  );
}

/**
 * Global cache (prevents multiple connections during hot reload)
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Connect Database
 */
async function connectDB(): Promise<typeof mongoose> {
  // Already connected
  if (cached.conn) {
    return cached.conn;
  }

  // Create connection promise once
  if (!cached.promise) {
    const options: mongoose.ConnectOptions = {
     family: 4, // ⭐⭐ THIS FIXES ATLAS CONNECTION ⭐⭐
      serverSelectionTimeoutMS: 15000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB Connected Successfully");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error);
        cached.promise = null;
        throw new Error("Database connection failed");
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error: any) {
    console.error(
      "❌ MongoDB Connection Failed:",
      error?.message || "Unknown error"
    );
    cached.promise = null;
    throw new Error("Database connection failed");
  }

  return cached.conn;
}

export default connectDB;
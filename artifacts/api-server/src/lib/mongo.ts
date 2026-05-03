import mongoose from "mongoose";
import { logger } from "./logger";

const uri = process.env["MONGODB_ATLAS_URI"];

let connection: typeof mongoose | null = null;
let connected = false;

export async function connectMongo() {
  if (!uri) {
    logger.warn("MONGODB_ATLAS_URI not set — running without database");
    return null;
  }
  if (connection) return connection;
  try {
    connection = await mongoose.connect(uri);
    connected = true;
    logger.info("MongoDB connected");
    return connection;
  } catch (err) {
    logger.error({ err }, "MongoDB connection failed");
    throw err;
  }
}

export function isConnected() {
  return connected;
}

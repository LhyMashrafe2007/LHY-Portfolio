import mongoose from "mongoose";

const uri = process.env["MONGODB_ATLAS_URI"];

if (!uri) {
  throw new Error("MONGODB_ATLAS_URI environment variable is required");
}

let connection: typeof mongoose | null = null;

export async function connectMongo() {
  if (connection) return connection;
  connection = await mongoose.connect(uri);
  return connection;
}

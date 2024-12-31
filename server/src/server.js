import * as http from "http";
import { app } from "./app.js";
import "dotenv/config";
import mongoose from "mongoose";
import { logMagenta } from "./utility/logger.js";

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING;

try {
  await mongoose.connect(MONGO_DB_CONNECTION_STRING);
  server.listen(PORT, () => {
    console.log("Your server is listening to port", PORT, "...");
    logMagenta(`http://localhost:${PORT}/`);
  });
} catch (error) {
  console.error("MongoDb connection failed ", error);
}

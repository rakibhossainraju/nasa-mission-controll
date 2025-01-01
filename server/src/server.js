import * as http from "http";
import { app } from "./app.js";
import "dotenv/config";
import mongoose from "mongoose";
import { logBlue, logMagenta } from "./utility/logger.js";

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING;

mongoose.connection.once("open", () => {
  logBlue("MongoDb connection ready!");
});
mongoose.connection.on("error", (error) => {
  console.error("MongoDb connection failed", error);
});

try {
  await mongoose.connect(MONGO_DB_CONNECTION_STRING);
  server.listen(PORT, () => {
    logMagenta(`http://localhost:${PORT}/`);
  });
} catch (error) {
  console.error("MongoDb connection failed ", error);
}

import * as http from "http";
import { app } from "./app.js";
import "dotenv/config";
import { logMagenta } from "./utility/logger.js";
import { connectMongoDb } from "./services/mongo.js";

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

try {
  await connectMongoDb();
  server.listen(PORT, () => {
    logMagenta(`http://localhost:${PORT}/`);
  });
} catch (error) {
  console.error("MongoDb connection failed ", error);
}

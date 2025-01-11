import "dotenv/config";
import http from "http";
import { app } from "./app.js";
import { logMagenta } from "./utility/logger.js";
import { connectMongoDb } from "./services/mongo.js";
import { loadLaunchData } from "./models/launches.model.js";

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

try {
  await connectMongoDb();
  await loadLaunchData();
  server.listen(PORT, () => {
    logMagenta(`http://localhost:${PORT}/`);
  });
} catch (error) {
  console.error("MongoDb connection failed ", error);
}

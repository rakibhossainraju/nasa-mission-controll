import * as http from "http";
import { app } from "./app.js";
import "dotenv/config";
import * as mongoose from "mongoose";
// import { loadHabitablePlanet } from "./models/planets.model.js";

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING;

mongoose
  .connect(MONGO_DB_CONNECTION_STRING)
  .then(() => {
    console.log("MongoDB successfully connected");
    server.listen(PORT, () => {
      console.log("Your server is listening to port", PORT, "...");
    });
  })
  // .then(loadHabitablePlanet)
  .catch((error) => {
    console.error("MongoDb connection failed ", error);
  });

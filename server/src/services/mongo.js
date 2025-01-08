import mongoose from "mongoose";
import { logBlue } from "../utility/logger.js";

//  ! You have to manually add the connection string while running the test.
const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING;

mongoose.connection.once("open", () => {
  logBlue("MongoDb connection ready!");
});
mongoose.connection.on("error", (error) => {
  console.error("MongoDb connection failed", error);
});

export async function connectMongoDb() {
  try {
    await mongoose.connect(MONGO_DB_CONNECTION_STRING);
  } catch (error) {
    console.error("MongoDb connection failed ", error);
  }
}

export async function disconnectMongoDb() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error("MongoDb disconnection failed ", error);
  }
}

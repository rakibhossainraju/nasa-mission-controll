import cors from "cors";
import express from "express";
import * as path from "path";
// import morgan from "morgan";
import fileDirName from "./utility/file-dir-name.utils.js";
import api from "./routes/api.js";

export const app = express();
const { __dirname } = fileDirName(import.meta.url);
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
// app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

// Version 1 of the API
app.use("/v1", api);

app.get(
  "/*",
  (req, res) =>
    res.sendFile(path.join(__dirname, "..", "public", "index.html")),
);

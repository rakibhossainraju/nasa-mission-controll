import cors from "cors";
import express from "express";
import { planetsRouter } from "./routes/planets/planets.router.js";
import * as path from "path";
// import morgan from "morgan";
import fileDirName from "./utility/file-dir-name.utils.js";
import { launchesRouter } from "./routes/launches/launches.router.js";

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

app.use("/planets", planetsRouter);
app.use("/launches", launchesRouter);

app.get(
  "/*",
  (req, res) =>
    res.sendFile(path.join(__dirname, "..", "public", "index.html")),
);

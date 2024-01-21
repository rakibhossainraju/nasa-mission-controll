import cors from "cors";
import express from "express";
import { planetsRouter } from "./routes/planets/planets.router.js";

export const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());
app.use("/planets", planetsRouter);

import express from "express";
import {
  httpAbortLaunch,
  httpGetAllLaunches,
  httpPostNewLaunch,
} from "./launches.controller.js";

export const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);

launchesRouter.post("/", httpPostNewLaunch);

launchesRouter.delete("/:launchId", httpAbortLaunch);

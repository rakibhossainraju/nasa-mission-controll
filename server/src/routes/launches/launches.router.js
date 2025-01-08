import express from "express";
import {
  httpAbortLaunch,
  httpAddNewLaunch,
  httpDeleteLaunch,
  httpGetAllLaunches,
} from "./launches.controller.js";

export const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);

launchesRouter.post("/", httpAddNewLaunch);

launchesRouter.delete("/:flightNumber", httpDeleteLaunch);

launchesRouter.put("/:launchId", httpAbortLaunch);

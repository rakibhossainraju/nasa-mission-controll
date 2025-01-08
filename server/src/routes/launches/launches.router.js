import express from "express";
import {
  httpAbortLaunch,
  httpAbortLaunchDelete,
  httpAddNewLaunch,
  httpDeleteLaunch,
  httpGetAllLaunches,
} from "./launches.controller.js";

export const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);

launchesRouter.post("/", httpAddNewLaunch);

launchesRouter.delete("/", httpAbortLaunchDelete);

launchesRouter.delete("/:flightNumber", httpDeleteLaunch);

launchesRouter.put("/:launchId", httpAbortLaunch);

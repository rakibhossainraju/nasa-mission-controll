import express from "express";
import {
  httpAbortLaunch,
  httpAddNewLaunch,
  httpGetAllLaunches,
} from "./launches.controller.js";

export const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);

launchesRouter.post("/", httpAddNewLaunch);

launchesRouter.put("/:launchId", httpAbortLaunch);

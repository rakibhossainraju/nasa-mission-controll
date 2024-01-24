import express from "express";
import { httpGetAllLaunches } from "./launches.controller.js";

export const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);

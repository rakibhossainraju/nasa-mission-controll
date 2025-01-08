import {
  abortLaunch,
  addNewLaunch,
  deleteLaunch,
  existsLaunchWithId,
  getAllLaunches,
} from "../../models/launches.model.js";
import { existsPlanetWithName } from "../../models/planets.model.js";

export async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

export async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.destination ||
    !launch.launchDate
  ) {
    return res.status(400).json({ error: "Missing required field" });
  }

  if (!(await existsPlanetWithName(launch.destination))) {
    return res.status(400).json({ error: "Invade Planet Name" });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({ error: "Invade Date" });
  }

  const resLaunch = await addNewLaunch(launch);
  return res
    .status(resLaunch ? 201 : 400)
    .json(resLaunch || { error: "Couldn't create Launch" });
}

export async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.launchId);

  if (!(await existsLaunchWithId(launchId))) {
    return res.status(404).json({ error: "No launch found" });
  }

  const abort = await abortLaunch(launchId);
  return res
    .status(abort ? 200 : 400)
    .json(abort || { error: "Couldn't abort launch" });
}

export async function httpDeleteLaunch(req, res) {
  const flightNumber = Number(req.params.flightNumber);

  if (isNaN(flightNumber) || flightNumber < 1) {
    return res.status(400).json({ error: "Invalid flight number" });
  }

  const { statusCode, ...response } = await deleteLaunch(flightNumber);

  return res.status(statusCode).json(response);
}

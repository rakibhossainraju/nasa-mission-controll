import {
  abortLaunch,
  addNewLaunch,
  deleteLaunch,
  existsLaunchWithId,
  getAllLaunches,
} from "../../models/launches.model.js";
import { getPagination } from "../../services/query.js";

export async function httpGetAllLaunches(req, res) {
  const paginate = getPagination(req.query);
  const launches = await getAllLaunches(paginate);

  return res
    .status(200)
    .json(launches);
}

export async function httpAddNewLaunch(req, res) {
  const launch = req.body;

  try {
    const resLaunch = await addNewLaunch(launch);
    return res.status(201).json(resLaunch);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

export async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.launchId);

  if (!(await existsLaunchWithId(launchId))) {
    return res
      .status(404)
      .json({ error: "No launch found" });
  }

  const abort = await abortLaunch(launchId);
  return res
    .status(abort ? 200 : 400)
    .json(abort || { error: "Couldn't abort launch" });
}

export async function httpDeleteLaunch(req, res) {
  const flightNumber = Number(req.params.flightNumber);

  if (isNaN(flightNumber) || flightNumber < 1) {
    return res
      .status(400)
      .json({ error: "Invalid flight number" });
  }

  const { statusCode, ...response } = await deleteLaunch(flightNumber);

  return res
    .status(statusCode)
    .json(response);
}

export async function httpForbidLaunchDelete(req, res) {
  return res
    .status(405)
    .json({ error: "Method not allowed" });
}

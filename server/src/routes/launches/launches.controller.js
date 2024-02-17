import {
  abortLaunch,
  addNewLaunch,
  existsLaunchWIthId,
  getAllLaunches,
} from "../../models/launches.model.js";

export function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

export function httpPostNewLaunch(req, res) {
  const launch = req.body;
  if (!launch.mission || !launch.rocket || !launch.destination)
    return res.status(400).json({ error: "Missing required field" });

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate) || launch.launchDate.getFullYear() < 2030)
    return res.status(400).json({ error: "Invade Date" });

  return res.status(201).json(addNewLaunch(launch));
}

export function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.launchId);
  if (!existsLaunchWIthId(launchId))
    return res.status(404).json({ error: "No launch found" });
  return res.status(200).json(abortLaunch(launchId));
}

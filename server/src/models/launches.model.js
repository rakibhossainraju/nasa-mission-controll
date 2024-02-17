export const launches = new Map();
let latestFlightNumber = 100;
const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  destination: "Kepler-442 b",
  customer: ["Light", "NASA"],
  upcoming: true,
  success: true,
};
launches.set(launch.flightNumber, launch);

export function getAllLaunches() {
  return Array.from(launches.values()).sort(
    (a, b) => a.flightNumber - b.flightNumber,
  );
}

export function addNewLaunch(launch) {
  latestFlightNumber++;
  const newLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber,
    upcoming: true,
    success: true,
    customer: ["Light", "NASA"],
  });
  launches.set(latestFlightNumber, newLaunch);
  return newLaunch;
}

export function existsLaunchWIthId(launchId) {
  return launches.has(launchId);
}
export function abortLaunch(launchId) {
  const abortedLaunch = Object.assign(launches.get(launchId), {
    upcoming: false,
    success: false,
  });
  launches.set(launchId, abortedLaunch);
  return abortedLaunch;
}

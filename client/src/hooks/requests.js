import { createSounds } from "arwes";

const baseURL = "http://localhost:8000";

export async function httpGetPlanets() {
  try {
    const res = await fetch(baseURL + "/planets");
    if (res.status !== 200) throw new Error("Fail to fetch Planets!");
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

export async function httpGetLaunches() {
  try {
    const res = await fetch(baseURL + "/launches");
    if (res.status !== 200) throw new Error("Fail to fetch Launches!");
    const data = await res.json();
    console.log(data);
    return data.sort((a, b) => a.flightNumber - b.flightNumber);
  } catch (error) {
    console.log(error);
  }
}

export async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

export async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

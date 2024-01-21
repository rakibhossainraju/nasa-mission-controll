const baseURL = "http://localhost:8000";

export async function httpGetPlanets() {
  try {
    const response = await fetch(baseURL + "/planets");
    if (response.status !== 200) throw new Error("Fail to fetch data!");
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
}

export async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

export async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

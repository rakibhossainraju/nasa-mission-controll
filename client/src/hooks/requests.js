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
  try {
    const res = await fetch(baseURL + "/launches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });
    const data = await res.json();
    if (res.status === 400) throw new Error(data.error);
    return { ok: true };
  } catch (error) {
    return { ok: false };
  }
}

export async function httpAbortLaunch(id) {
  console.log(id);
  try {
    const res = await fetch(baseURL + "/launches/" + id, {
      method: "DELETE",
    });
    const data = await res.json();
    if (res.status === 400) throw new Error(data.error);
    return { ok: true };
  } catch (error) {
    return { ok: false };
  }
}

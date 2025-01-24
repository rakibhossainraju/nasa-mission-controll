import axios from "axios";
import launchesDatabase from "./launches.mongo.js";
import { existsPlanetWithName } from "./planets.model.js";

//Get All the planets
export async function getAllLaunches({ skip, limit }) {
  return launchesDatabase
    .find({}, " -_id -__v -upsertedId")
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

//Add new launch
export async function addNewLaunch(launch) {
  const fieldNames = ["mission", "rocket", "destination", "launchDate"];
  const missingField = fieldNames.find((field) => !launch[field]);

  if (missingField) {
    throw new Error(`Missing required field ${missingField}`);
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    throw new Error("Invalid Date");
  }

  const planet = await existsPlanetWithName(launch.destination);
  if (!planet) {
    throw new Error("No matching planet found");
  }

  return await scheduleNewLaunch(launch);
}

async function saveLaunch(launch) {
  try {
    await launchesDatabase.updateOne(
      { flightNumber: launch.flightNumber },
      launch,
      { upsert: true },
    );
    delete launch.$setOnInsert;
    return launch;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function saveLaunches(launches) {
  try {
    const bulkOperations = launches.map((launch) => ({
      updateOne: {
        filter: { flightNumber: launch.flightNumber },
        update: { $set: launch },
        upsert: true,
      },
    }));

    const result = await launchesDatabase.bulkWrite(bulkOperations);
    console.log(
      `Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}, Upserted: ${result.upsertedCount}`,
    );

    return launches;
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = {
    ...launch,
    flightNumber: newFlightNumber,
    customers: ["Zero to Mastery", "NASA"],
  };
  return await saveLaunch(newLaunch);
}

async function getLatestFlightNumber() {
  const lastLaunch = await launchesDatabase
    .findOne()
    .sort("-flightNumber");

  if (!lastLaunch) return 100;

  return lastLaunch.flightNumber;
}

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter, " -_id -__v -upsertedId");
}

//Check if a planet exists or not / and also get the launch
export async function existsLaunchWithId(launchId) {
  return findLaunch({ flightNumber: launchId });
}

export async function abortLaunch(launchId) {
  const previousLaunch = await existsLaunchWithId(launchId);
  try {
    await launchesDatabase.updateOne(
      { flightNumber: launchId },
      { upcoming: false, success: false },
    );
    return { ...previousLaunch._doc, upcoming: false, success: false };
  } catch (error) {
    console.log("Couldn't abort launch", error);
    return null;
  }
}

export async function deleteLaunch(flightNumber) {
  if (flightNumber === undefined) {
    return { statusCode: 400, error: "Invalid flight number provided" };
  }

  try {
    const result = await launchesDatabase.deleteOne({ flightNumber });

    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        error: "No mission found with the given flight number",
        flightNumber,
      };
    }

    return {
      statusCode: 200,
      message: "Mission was deleted successfully",
      flightNumber,
    };
  } catch (error) {
    console.error("Error while deleting mission:", error);
    return {
      statusCode: 500,
      error: "An error occurred while trying to delete the mission",
    };
  }
}

async function populateLaunches() {
  const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";
  const query = {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  };

  try {
    console.log("Downloading launch data...");

    const response = await axios.post(SPACEX_API_URL, query);

    if (response.status !== 200) {
      throw new Error("Launch data download failed");
    }
    const launchDocs = response.data.docs;
    const launches = [];

    for (const launchDoc of launchDocs) {
      const launch = {
        flightNumber: launchDoc["flight_number"],
        mission: launchDoc["name"],
        rocket: launchDoc["rocket"]["name"],
        launchDate: launchDoc["date_local"],
        upcoming: launchDoc["upcoming"],
        success: launchDoc["success"] ?? false,
      };

      const payloads = launchDoc["payloads"];
      const customers = payloads.flatMap((payload) => payload["customers"]);

      launch["customers"] = customers;
      launches.push(launch);
    }
    await saveLaunches(launches);
  } catch (error) {
    console.error(error);
  }
}

export async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launch data already loaded");
    return;
  }

  await populateLaunches();
  console.log("Launch data loaded");
}

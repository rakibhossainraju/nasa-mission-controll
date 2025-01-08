import launchesMongo from "./launches.mongo.js";

//Get All the planets
export async function getAllLaunches() {
  return launchesMongo.find({}, " -_id -__v -upsertedId");
}

//Add new launch
export async function addNewLaunch(launch) {
  return await saveLaunch(launch);
}

//Add a launch util f()
async function saveLaunch(launch) {
  try {
    const latestFlightNumber = 100 + (await getAllLaunches()).length;
    const newLaunch = {
      ...launch,
      flightNumber: latestFlightNumber,
      upcoming: true,
      success: true,
      customers: ["Light", "NASA"],
    };
    await launchesMongo.updateOne(
      { flightNumber: launch.flightNumber },
      { ...newLaunch },
      { upsert: true },
    );
    return newLaunch;
  } catch (error) {
    console.error(error);
    return null;
  }
}

//Check if a planet exists or not / and also get the launch
export async function existsLaunchWithId(launchId) {
  return launchesMongo.findOne(
    { flightNumber: launchId },
    " -_id -__v -upsertedId",
  );
}

export async function abortLaunch(launchId) {
  const previousLaunch = await existsLaunchWithId(launchId);
  try {
    await launchesMongo.updateOne(
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
    const result = await launchesMongo.deleteOne({ flightNumber });

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

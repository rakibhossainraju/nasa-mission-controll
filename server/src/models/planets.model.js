import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import fileDirName from "../utility/file-dir-name.utils.js";
import planetsMongo from "./planets.mongo.js";

const isHabitablePlanet = (planet) =>
  planet["koi_disposition"] === "CONFIRMED" &&
  planet["koi_insol"] > 0.36 &&
  planet["koi_insol"] < 1.11 &&
  planet["koi_prad"] < 1.6;

export async function loadHabitablePlanet() {
  const { __dirname } = fileDirName(import.meta.url);
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "data", "kepler_data.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        }),
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          await savePlanet(data);
        }
      })
      .on("error", reject)
      .on("end", async () => {
        console.log(
          (await getAllHabitablePlanets()).length,
          "Habitable planets found",
        );
        resolve();
      });
  });
}

async function savePlanet(planet) {
  try {
    await planetsMongo.updateOne(
      { keplerName: planet.kepler_name },
      { keplerName: planet.kepler_name },
      { upsert: true },
    );
  } catch (error) {
    console.error("Couldn't save a planet ", error);
  }
}
export async function getAllHabitablePlanets() {
  return planetsMongo.find({}, "keplerName -_id");
}

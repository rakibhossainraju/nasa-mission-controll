import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import fileDirName from "../utility/file-dir-name.utils.js";

export const habitablePlanets = [];
const isHabitablePlanet = (planet) =>
  planet["koi_disposition"] === "CONFIRMED" &&
  planet["koi_insol"] > 0.36 &&
  planet["koi_insol"] < 1.11 &&
  planet["koi_prad"] < 1.6;

export function loadHabitablePlanet() {
  const { __dirname } = fileDirName(import.meta.url);
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "data", "kepler_data.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        }),
      )
      .on("data", (data) => {
        isHabitablePlanet(data) && habitablePlanets.push(data);
      })
      .on("error", reject)
      .on("end", resolve);
  });
}

export function getAllHabitablePlanets() {
  return habitablePlanets;
}

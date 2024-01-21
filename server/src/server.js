import * as http from "http";
import { app } from "./app.js";
import { loadHabitablePlanet } from "./models/planets.model.js";

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

server.listen(PORT, async () => {
  await loadHabitablePlanet();
  console.log("Your server is listing to port", PORT, "...");
});

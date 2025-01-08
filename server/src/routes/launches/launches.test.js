import request from "supertest";
import { connectMongoDb, disconnectMongoDb } from "../../services/mongo.js";
import { app } from "../../app.js";

describe("Launches API", () => {
  beforeAll(async () => {
    await connectMongoDb();
  });
  afterAll(async () => {
    await disconnectMongoDb();
  });

  describe("Test GET /launches", () => {
    test("It should respond with 200 success", async () => {
      await request(app)
        .get("/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
  // This will set the flightNumber after it's been successfully created.
  // The flight number is been used to delete the created launch.
  // It could have been done with a callback, but it will become callback hell for me.
  let setFlightNumber;
  const flightNumberPromise = new Promise((res) => setFlightNumber = res);

  describe("Test POST /launch", () => {
    const completeLaunchData = {
      mission: "USS EnterPrise",
      rocket: "NCC 1901-D",
      destination: "Kepler-1652 b",
      launchDate: "January 4, 2028",
    };
    const launchDataWithoutDate = {
      mission: "USS EnterPrise",
      rocket: "NCC 1901-D",
      destination: "Kepler-1652 b",
    };

    test("It should respond 201 success", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);
      setFlightNumber(response.body.flightNumber);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: "Missing required field" });
    });

    test("It should catch Invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send({ ...completeLaunchData, destination: "earth" })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: "Invade Planet Name" });
    });

    test("It should catch Invalid dates", async () => {
      const response = await request(app)
        .post("/launches")
        .send({ ...launchDataWithoutDate, launchDate: "zoot" })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: "Invade Date" });
    });
  });

  describe("Test PUT /launches", () => {
    test("It should respond 200 success", async () => {
      const response = await request(app)
        .put("/launches/100")
        .expect("Content-Type", /json/)
        .expect(200);
    });

    test("It shouldn't find any Launch respond with 404", async () => {
      const response = await request(app)
        .put("/launches/89")
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body).toStrictEqual({ error: "No launch found" });
    });
  });

  describe("Test DELETE /launch", () => {

    test("It should respond 200 success", async () => {
      const flightNumber = await flightNumberPromise;
      console.error("FLIGHT NUMBER", flightNumber);
      const response = await request(app)
        .delete(`/launches/${flightNumber}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body)
        .toStrictEqual({
          message: "Mission was deleted successfully",
          flightNumber,
        });
    });

    // test.each(['bad-request', '', -1, 0])
    // ("It shouldn't find any launch respond with 400 bad request", async (invaledFLigtNumber) => {
    //   const response = await request(app)
    //     .delete(`/launches/${invaledFLigtNumber}`)
    //     .expect("Content-Type", /json/)
    //     .expect(400);
    //
    //   expect(response.body).toStrictEqual({ error: "Invalid flight number" });
    // });

  });
});

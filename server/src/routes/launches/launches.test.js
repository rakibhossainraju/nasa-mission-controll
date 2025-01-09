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
  let runSingleTest = false;

  describe("Test GET /launches", () => {
    if (runSingleTest) return;

    test("should respond with 200 and return list of launches", async () => {
      await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
  // This will set the flightNumber after it's been successfully created.
  // The flight number is been used to delete the created launch.
  // It could have been done with a callback, but it will become callback hell for me.
  let setFlightNumber;
  const flightNumberPromise = new Promise((res) => setFlightNumber = res);

  describe("Test POST /launches", () => {
    if (runSingleTest) return;

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

    test("should respond with 201 and create new launch with valid data", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);
      setFlightNumber(response.body.flightNumber);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("should respond with 400 when required launch properties are missing", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required field launchDate",
      });
    });

    test("should respond with 400 when destination planet is invalid", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({ ...completeLaunchData, destination: "earth" })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: "Invalid Planet Name" });
    });

    test("should respond with 400 when launch date is invalid", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({ ...launchDataWithoutDate, launchDate: "zoot" })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: "Invalid Date" });
    });
  });

  describe("Test PUT /launches", () => {
    if (runSingleTest) return;

    test("should respond with 200 when successfully updating an existing launch", async () => {
      const response = await request(app)
        .put("/v1/launches/100")
        .expect("Content-Type", /json/)
        .expect(200);
    });

    test("should respond with 404 when updating non-existent launch", async () => {
      const response = await request(app)
        .put("/v1/launches/89")
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body).toStrictEqual({ error: "No launch found" });
    });
  });

  describe("Test DELETE /launches", () => {
    test("should respond with 200 when successfully deleting an existing launch", async () => {
      if (runSingleTest) return;

      const flightNumber = await flightNumberPromise;
      const response = await request(app)
        .delete(`/v1/launches/${flightNumber}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body)
        .toStrictEqual({
          message: "Mission was deleted successfully",
          flightNumber,
        });
    });

    test.each(["bad-request", -1, 0])(
      "should respond with 400 when flight number '%s' is invalid",
      async (invalidFlightNumber) => {
        const response = await request(app)
          .delete(`/v1/launches/${invalidFlightNumber}`)
          .expect("Content-Type", /json/)
          .expect(400);

        expect(response.body).toStrictEqual({ error: "Invalid flight number" });
      },
    );

    test("should respond with 404 when deleting non-existent launch", async () => {
      const flightNumber = 1290213402934809;
      const response = await request(app)
        .delete(`/v1/launches/${flightNumber}`)
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body)
        .toStrictEqual({
          error: "No mission found with the given flight number",
          flightNumber,
        });
    });

    test.each([""])(
      "should respond with 403 when attempting to delete with forbidden parameters",
      async (forBiddenParams) => {
        const response = await request(app)
          .delete(`/v1/launches/${forBiddenParams}`)
          .expect("Content-Type", /json/)
          .expect(405);

        expect(response.body).toStrictEqual({ error: "Method not allowed" });
      },
    );
  });
});

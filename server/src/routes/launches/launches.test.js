import request from "supertest";
import { app } from "../../app.js";

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Test POST /launch", () => {
  const completeLaunchData = {
    mission: "USS EnterPrise",
    rocket: "NCC 1901-D",
    destination: "Kepler-186 f",
    launchDate: "January 4, 2028",
  };
  const launchDataWithoutDate = {
    mission: "USS EnterPrise",
    rocket: "NCC 1901-D",
    destination: "Kepler-186 f",
  };

  test("It should respond 201 success", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

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

  test("It should catch missing Invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send({ ...launchDataWithoutDate, launchDate: "zoot" })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({ error: "Invade Date" });
  });
});

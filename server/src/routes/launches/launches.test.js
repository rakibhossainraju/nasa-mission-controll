import request from "supertest";
// import { app } from "../../app.js";

const testEnvironment = "http://localhost:8000";

//When you run this test an unnecessary launch will be created. you can go to you cluster and delete that
describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    await request(testEnvironment)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

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
    const response = await request(testEnvironment)
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
    const response = await request(testEnvironment)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({ error: "Missing required field" });
  });

  test("It should catch Invalid dates", async () => {
    const response = await request(testEnvironment)
      .post("/launches")
      .send({ ...completeLaunchData, destination: "earth" })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({ error: "Invade Planet Name" });
  });

  test("It should catch Invalid dates", async () => {
    const response = await request(testEnvironment)
      .post("/launches")
      .send({ ...launchDataWithoutDate, launchDate: "zoot" })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({ error: "Invade Date" });
  });
});

describe("Test PUT /launches", () => {
  test("It should respond 200 success", async () => {
    const response = await request(testEnvironment)
      .put("/launches/100")
      .expect("Content-Type", /json/)
      .expect(200);
  });

  test("It shouldn't find any Launch respond with 404", async () => {
    const response = await request(testEnvironment)
      .put("/launches/89")
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toStrictEqual({ error: "No launch found" });
  });
});

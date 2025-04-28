const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../api.js");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object containing all topics with correct formatted data within", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        console.log(topics, "<---topics, test");

        expect(topics).toHaveLength(3);
        expect(typeof topics).toBe("object");
        topics.forEach((topic) => {
          expect(topic).toEqual({
            description: expect.any(String),
            slug: expect.any(String),
            img_url: expect.any(String),
          });
        });
      });
  });

  test("404: not found, spelling mistake in the path / wrong path", () => {
    return request(app).get("/wrongpath").expect(404)
    .then((errmsg) => {
      console.log(errmsg.res.statusMessage, "<--errmsg");
      expect(errmsg.res.statusMessage).toBe("Not Found");
    }); 
    //probably we don't need .then clause, just expect(404) is enough in this case
  });
});

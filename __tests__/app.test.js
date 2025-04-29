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
      .then(({body}) => {
        const topics = body.topics;
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
});

describe("GET /wrongpath", () => {
  test("404: not found, spelling mistake in the path / wrong path", () => {
    return request(app).get("/wrongpath").expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found");
    }); 
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: sends response with correct article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("400: Bad Request! when a string passed instead of valid article_id", () => {
    return request(app)
      .get("/api/articles/NotAnId")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad Request!");
      })
  });

  test("404: Not Found! when passed a valid number, but not existing article_id", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Not Found!");
      })
  });
});
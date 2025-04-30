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

describe("GET /wrongpath", () => {
  test("404: not found, spelling mistake in the path / wrong path", () => {
    return request(app).get("/wrongpath").expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Not Found");
    }); 
  });
});

//1 - CORE: GET /api
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

//2 - CORE: GET /api/topics
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
            img_url: expect.any(String)
          });
        });
      });
  });
});

//3 - CORE: GET /api/articles/:article_id
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
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
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

  test("404: ID Not Found! when passed a valid number, but not existing article_id", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("ID Not Found!");
      })
  });
});

//4 - CORE: GET /api/articles
describe("GET /api/articles", () => {
  test("200: Responds with an object containing all articles sorted in descending order, without body property, but having comment_count property, which is the total count of all the comments with this article_id", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body}) => {
        const articles = body.articles;
        expect(articles).toHaveLength(13);
        expect(typeof articles).toBe("object");
        articles.forEach((article) => {
          expect(article).toEqual({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url:
          expect.any(String),
          comment_count: expect.any(Number)
          });
        });
      });
  });
});

//5 - CORE: GET /api/articles/:article_id/comments
describe("GET /api/articles/:article_id/comments", () => {
  test("200: sends response with an array of comments for the given article_id = 3", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toHaveLength(2);
        expect(typeof comments).toBe("object");
        expect(comments).toEqual([
          {
            comment_id: 11,
            article_id: 3,
            body: 'Ambidextrous marsupial',
            votes: 0,
            author: 'icellusedkars',
            created_at: '2020-09-19T23:10:00.000Z'
          },
          {
            comment_id: 10,
            article_id: 3,
            body: 'git push origin master',
            votes: 0,
            author: 'icellusedkars',
            created_at: '2020-06-20T07:24:00.000Z'
          }
        ]);
        comments.forEach((comment) => {
          expect(comment).toEqual({
          comment_id: expect.any(Number),
          article_id: expect.any(Number),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          body: expect.any(String)
          });
        });
      });
  });

  test("200: sends response with an array of comments for the given article_id = 1", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        expect(comments).toHaveLength(11);
        expect(typeof comments).toBe("object");
        comments.forEach((comment) => {
          expect(comment).toEqual({
          comment_id: expect.any(Number),
          article_id: expect.any(Number),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          body: expect.any(String)
          });
        });
      });
  });

  test("200: responds with empty array when passed a valid article_id, but no comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({body: {comments}}) => {
        expect(comments).toEqual([]);
      })
  });

  test("400: Bad Request! when a string passed instead of valid article_id", () => {
    return request(app)
      .get("/api/articles/NotAnId/comments")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad Request!");
      })
  });

  test("404: ID Not Found! when passed a valid number, but not existing article_id", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("ID Not Found!");
      })
  });

});
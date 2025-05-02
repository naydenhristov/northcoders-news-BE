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
    return request(app)
      .get("/wrongpath")
      .expect(404)
      .then(({ body }) => {
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
      .then(({ body }) => {
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
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("400: Bad Request! when a string passed instead of valid article_id", () => {
    return request(app)
      .get("/api/articles/NotAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });

  test("404: ID Not Found! when passed a valid number, but not existing article_id", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID Not Found!");
      });
  });
});

//4 - CORE: GET /api/articles
describe("GET /api/articles", () => {
  test("200: Responds with an object containing all articles sorted in descending order, without body property, but having comment_count property, which is the total count of all the comments with this article_id", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
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
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
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
            body: "Ambidextrous marsupial",
            votes: 0,
            author: "icellusedkars",
            created_at: "2020-09-19T23:10:00.000Z",
          },
          {
            comment_id: 10,
            article_id: 3,
            body: "git push origin master",
            votes: 0,
            author: "icellusedkars",
            created_at: "2020-06-20T07:24:00.000Z",
          },
        ]);
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
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            article_id: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            body: expect.any(String),
          });
        });
      });
  });

  test("200: responds with empty array when passed a valid article_id, but no comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });

  test("400: Bad Request! when a string passed instead of valid article_id", () => {
    return request(app)
      .get("/api/articles/NotAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });

  test("404: ID Not Found! when passed a valid number, but not existing article_id", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID Not Found!");
      });
  });
});

//6 - CORE: POST /api/articles/:article_id/comments
describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with added comment for the given article_id = 4", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send({
        username: "icellusedkars",
        body: "New Comment Body",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toHaveLength(1);
        expect(typeof comment).toBe("object");
        expect(comment).toEqual([
          {
            comment_id: 19,
            article_id: 4,
            body: "New Comment Body",
            votes: 0,
            author: "icellusedkars",
            created_at: expect.any(String),
          },
        ]);
      });
  });

  test("400: Bad Request! when a string passed instead of valid article_id", () => {
    return request(app)
      .post("/api/articles/NotAnId/comments")
      .send({
        username: "icellusedkars",
        body: "New Comment Body",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });

  test("404: ID Not Found! when passed a valid number, but not existing article_id", () => {
    return request(app)
      .post("/api/articles/1000/comments")
      .send({
        username: "icellusedkars",
        body: "New Comment Body",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("ID Not Found!");
      });
  });

  test("404: User Not Found! when passed a non existing username", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "blabla",
        body: "Another New Comment Body",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User Not Found in users table!");
      });
  });

  test("400: Bad Request! No username provided! when passed a request with missing username", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        body: "Another New Comment Body",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request! No username provided!");
      });
  });

  test("400: Bad Request! No comment body provided! when passed a request with missing comment body", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "icellusedkars",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request! No comment body provided!");
      });
  });
});

//7 - CORE: PATCH /api/articles/:article_id
describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with updated article (POSITIVE value of votes property if POSITIVE result after adding new votes)", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 1,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("200: responds with updated article (votes property value equal to 0 if NEGATIVE result after adding new votes)", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("400: Bad Request! when a string passed instead of valid article_id", () => {
    return request(app)
      .patch("/api/articles/NotAnId")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });

  test("404: Invalid ID - Article Not Found in articles table! when passed a valid number, but not existing article_id", () => {
    return request(app)
      .patch("/api/articles/1000")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID - Article Not Found in articles table!");
      });
  });

  test("400: Bad Request - Invalid Amount of Votes! when a string passed instead of valid article_id", () => {
    return request(app)
      .patch("/api/articles/NotAnId")
      .send({ inc_votes: "aaa" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request - Invalid Amount of Votes!");
      });
  });

});

//8 - CORE: DELETE /api/comments/:comment_id
describe(" DELETE /api/comments/:comment_id", () => {
  test("204: responds with status 204 and no content", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  test("400: Bad Request! when a string passed instead of valid comment_id", () => {
    return request(app)
      .delete("/api/comments/NotAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request!");
      });
  });

  test("404: Invalid ID - Comment Not Found! when passed a valid number, but not existing comment_id", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID - Comment Not Found in comments table!");
      });
  });
});

//9 - CORE: GET /api/users
describe("GET /api/users", () => {
  test("200: Responds with an object containing all users with correct formatted data within", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users).toHaveLength(4);
        expect(typeof users).toBe("object");
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

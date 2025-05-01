const express = require("express");
const app = express();
const {
  getApi,
  getTopics,
  getArticleById,
  getArticlesSorted,
  getCommentsByArticleId,
  postCommentsByArticleId,
  patchArticleById
} = require("./app/nc_news.controller");
const { handlePSQLErrors, handleCustomErrors, handleServerErrors } =
  require("./errors/errors");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticlesSorted);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentsByArticleId);

app.patch("/api/articles/:article_id", patchArticleById);

//Single error handled by express (bad urls) below
app.all("/*splat", (req, res) => {
    res.status(404).send({ msg: "Not Found" });
  });

//Error handling middleware chain below
app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;

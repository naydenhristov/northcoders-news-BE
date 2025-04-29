const express = require("express");
const app = express();
const {
  getApi,
  getTopics,
  getArticleById,
} = require("./app/nc_news.controller");
const { handlePSQLErrors, handleCustomErrors, handleServerErrors } =
  require("./errors/errors");

//app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

//Single error handled by express (bad urls) below
app.all("/*splat", (req, res) => {
    res.status(404).send({ msg: "Not Found" });
  });

//Error handling middleware chain below
app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(handleServerErrors);

module.exports = app;

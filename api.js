const express = require("express");
const app = express();
const {
    getApi
} = require("./app/nc_news.controller")

app.use(express.json());

app.get("/api", getApi);

app.all("/splat", (req, res) => {
    res.status(404).send({msg: "Not Found"});
});
module.exports = app;
const endpoints = require("../endpoints.json");
const { 
    selectTopics
 } = require("./nc_news.model");


exports.getApi = (req, res) => {
    res.status(200).send(endpoints);
}

exports.getTopics = (req, res, next) => {
    return selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
     console.log(err.code, "<-----controller error, getTreasures");
      next(err);
    })
}
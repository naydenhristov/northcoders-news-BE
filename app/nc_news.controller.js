const endpoints = require("../endpoints.json");
const { 
    selectTopics,
    selectArticleById,
    selectArticlesSorted
 } = require("./nc_news.model");


exports.getApi = (req, res) => {
    res.status(200).send(endpoints);
}

exports.getTopics = (req, res, next) => {
    return selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
}

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params;
    
    selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
}

exports.getArticlesSorted = (req, res, next) => {
  return selectArticlesSorted()
  .then((articles) => {
    res.status(200).send({ articles });
  })
  .catch(next);
}
const endpoints = require("../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectArticlesSorted,
  selectCommentsByArticleId,
  insertCommenttByArticleId,
  validUsername,
} = require("./nc_news.model");

exports.getApi = (req, res) => {
  res.status(200).send(endpoints);
};

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticlesSorted = (req, res, next) => {
  selectArticlesSorted()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const pendingArticleById = selectArticleById(article_id);
  const pendingCommentsByArticleId = selectCommentsByArticleId(article_id);

  Promise.all([pendingCommentsByArticleId, pendingArticleById])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const newComment = req.body;
  if (!newComment.hasOwnProperty("username")) {
    res.status(400).send({msg: "Bad Request! No username provided!"});
  }
  if (!newComment.hasOwnProperty("body")) {
    res.status(400).send({msg: "Bad Request! No comment body provided!"});
  }
  const validUser = validUsername(newComment.username);

  Promise.all([validUser])
    .then(() => {
      return insertCommenttByArticleId(article_id, newComment)
        .then((comment) => {
          res.status(201).send({ comment });
        })
        .catch(next);
    })
    .catch(next);
};

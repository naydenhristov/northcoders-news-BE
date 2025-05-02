const endpoints = require("../endpoints.json");
const {
  selectTopics,
  selectArticleById,
  selectArticlesSorted,
  selectCommentsByArticleId,
  insertCommenttByArticleId,
  validUsername,
  updateArticleByID,
  removeCommentByID,
  validCommentById,
  selectUsers
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
    return res.status(400).send({ msg: "Bad Request! No username provided!" });
  }
  if (!newComment.hasOwnProperty("body")) {
    return res.status(400).send({ msg: "Bad Request! No comment body provided!" });
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

exports.patchArticleById = (req, res) => {
  const { article_id } = req.params;
  const patchBody = req.body;

  updateArticleByID(article_id, patchBody).then((article) => {
    res.status(200).send({ article });
  });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const validComment = validCommentById(comment_id);

  Promise.all([validComment])
    .then(() => {
      return removeCommentByID(comment_id)
        .then(() => {
          res.status(204).send();
        })
        .catch(next);
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
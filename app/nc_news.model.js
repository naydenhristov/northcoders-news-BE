const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({ status: 404, msg: "ID Not Found!" });
      }

      return result.rows[0];
    });
};

exports.selectArticlesSorted = () => {
  return db
    .query(
      `SELECT 
    articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.insertCommenttByArticleId = (article_id, newComment) => {
  return db
    .query(
      `INSERT INTO comments (article_id, body, votes, author, created_at) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`,
      [article_id, newComment.body, 0, newComment.username, new Date()]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.validUsername = (username) => {
  return db
    .query("SELECT username FROM users WHERE username = $1", [username])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          msg: "User Not Found in users table!",
        });
      }
      return;
      //return result.rows[0]; -> if needed at a later stage
    });
};

exports.updateArticleByID = (article_id, patchBody) => {
  const votes = patchBody.inc_votes;
  return db
    .query(
      `
  UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`,
      [votes, article_id]
    )
    .then((result) => {
      if (result.rows[0].votes < 0) {
        return db
          .query(
            `
      UPDATE articles
      SET votes = 0
      WHERE article_id = $1 AND votes < 0
      RETURNING *;`,
            [article_id]
          )
          .then((result2) => {
            return result2.rows[0];
          });
      } else {
        return result.rows[0];
      }
    });
};

exports.removeCommentByID = (comment_id) => {
  return db.query(
    `DELETE FROM comments
  WHERE comment_id = $1;`,
    [comment_id]
  );
};

exports.validCommentById = (comment_id) => {
  return db
    .query("SELECT comment_id FROM comments WHERE comment_id = $1", [
      comment_id,
    ])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Comment Not Found in comments table!",
        });
      }
      return;
      //return result.rows[0]; -> if needed at a later stage
    });
};

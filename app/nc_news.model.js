const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then((result) => {
          if(!result.rows.length) {
              return Promise.reject({ status: 404, msg: "ID Not Found!"})
          }
  
        return result.rows[0];
      });
};

exports.selectArticlesSorted = () => {
  return db.query(`SELECT 
    articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.article_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;`).then((result) => {
    return result.rows;
  });
};

exports.selectCommentsByArticleId = (article_id) => {
  return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id]).then((result) => {
      return result.rows;
    });
};

exports.insertCommenttByArticleId = (article_id, newComment) => {

  return db.query(`INSERT INTO comments (article_id, body, votes, author, created_at) 
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;`, [article_id, newComment.body, 0, newComment.username, new Date()]).then((result) => {
      return result.rows;
    });
};

exports.validUsername = (username) => {
  return db.query("SELECT username FROM users WHERE username = $1", [username]).then((result) => {
    if(!result.rows.length) {
      return Promise.reject({ status: 404, msg: "User Not Found in users table!"})
  }
    return result.rows[0];
  });
}
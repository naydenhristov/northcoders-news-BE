const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then((result) => {
          if(!result.rows.length) {
              return Promise.reject({ status: 404, msg: "Not Found!"})
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
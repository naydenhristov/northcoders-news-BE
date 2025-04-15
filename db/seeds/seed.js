const format = require("pg-format");
const db = require("../connection");
const { convertTimestampToDate } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db //deleting tables in reverse order if they exist
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      //creating tables
      return db.query(`CREATE TABLE topics(
      slug VARCHAR(100) PRIMARY KEY,
      description VARCHAR(1000),
      img_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
      username VARCHAR(500) PRIMARY KEY,
      name VARCHAR(500),
      avatar_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(500),
      topic VARCHAR(500) REFERENCES topics(slug),
      author VARCHAR(500) REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE comments(
          comment_id SERIAL PRIMARY KEY,
          article_id INT REFERENCES articles(article_id),
          body TEXT,
          votes INT DEFAULT 0,
          author VARCHAR(500) REFERENCES users(username),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`);
    })
    .then(() => {
      const formattedTopics = topicData.map((topic) => {
        return [
          topic.slug,
          topic.description,
          topic.img_url
        ]
      });
      const insertTopicsQuery = format(
        `INSERT INTO topics VALUES %L`, formattedTopics
      );
      return db.query(insertTopicsQuery);
    }).then(() => {
      const formattedUsers = userData.map((user) => {
        return [
          user.username,
          user.name,
          user.avatar_url
        ]
      });
      const insertUsersQuery = format(
        `INSERT INTO users VALUES %L`, formattedUsers
      );
      return db.query(insertUsersQuery);
    }).then(() => {
      const formattedArticles = articleData.map((article) => {
        const formattedDate = convertTimestampToDate(article.created_at);
        return [
          article.title,
          article.topic,
          article.author,
          article.body,
          formattedDate.created_at,
          article.votes,
          article.article_img_url,
        ]
      });
      const insertArticlesQuery = format(
        `INSERT INTO articles(title, topic, author, body, created_at, 
        votes, article_img_url) VALUES %L`, formattedArticles
      );
      return db.query(insertArticlesQuery);
    });
};

module.exports = seed;

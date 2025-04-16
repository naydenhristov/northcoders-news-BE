const format = require("pg-format");
const db = require("../connection");
const { convertTimestampToDate, createRef } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db //deleting tables in reverse order if they exist
    .query(`DROP TABLE IF EXISTS comments;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics;`);
    })
    .then(() => {
      //creating tables
      return db.query(`CREATE TABLE topics(
      slug VARCHAR(100) PRIMARY KEY,
      description VARCHAR(1500),
      img_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE users(
      username VARCHAR(500) PRIMARY KEY NOT NULL UNIQUE,
      name VARCHAR(500),
      avatar_url VARCHAR(1000)
      );`);
    })
    .then(() => {
      return db.query(`CREATE TABLE articles(
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      topic VARCHAR(500) REFERENCES topics(slug),
      author VARCHAR(500) REFERENCES users(username),
      body TEXT NOT NULL,
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
        return [topic.slug, topic.description, topic.img_url];
      });
      const insertTopicsQuery = format(
        `INSERT INTO topics VALUES %L`,
        formattedTopics
      );
      return db.query(insertTopicsQuery);
    })
    .then(() => {
      const formattedUsers = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });
      const insertUsersQuery = format(
        `INSERT INTO users VALUES %L`,
        formattedUsers
      );
      return db.query(insertUsersQuery);
    })
    .then(() => {
      const formattedArticles = articleData.map((article) => {
        const legitimateArticle = convertTimestampToDate(article);
        return [
          legitimateArticle.title,
          legitimateArticle.topic,
          legitimateArticle.author,
          legitimateArticle.body,
          legitimateArticle.created_at,
          legitimateArticle.votes,
          legitimateArticle.article_img_url
        ];
      });
      const insertArticlesQuery = format(
        `INSERT INTO articles(title, topic, author, body, created_at, 
        votes, article_img_url) VALUES %L RETURNING *`,
        formattedArticles
      );
      return db.query(insertArticlesQuery);
    })
    .then((articleTable) => {
      const articlesReObject = createRef(articleTable.rows);
      const formattedComments = commentData.map((comment) => {
        const legitComment = convertTimestampToDate(comment);
        return [
          articlesReObject[comment.article_title],
          legitComment.body,
          legitComment.votes,
          legitComment.author,
          legitComment.created_at
        ];
      });
      const insertCommentsQuery = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at)
        VALUES %L`, formattedComments
      )
      return db.query(insertCommentsQuery);
    })
    .then(() => {
      console.log("Seed completed");
    });
};

module.exports = seed;

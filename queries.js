const db = require("./db/connection");
const fs = require("fs");

// Get all of the users
// db.query("SELECT * FROM users").then((result) => {
//     fs.writeFile("./output-users.json", JSON.stringify(result), (err) => {
//       if (err) console.log(err);
//     });
//   });

// Get all of the articles where the topic is coding
//   db.query("SELECT * FROM articles WHERE topic = 'coding'").then((result) => {
//     fs.writeFile("./output-articles.json", JSON.stringify(result), (err) => {
//       if (err) console.log(err);
//     });
//   });

// Get all of the comments where the votes are less than zero
//   db.query("SELECT * FROM comments WHERE votes < 0").then((result) => {
//     fs.writeFile("./output-comments.json", JSON.stringify(result), (err) => {
//       if (err) console.log(err);
//     });
//   });

// Get all of the topics
//   db.query("SELECT * FROM topics").then((result) => {
//     fs.writeFile("./output-topics.json", JSON.stringify(result), (err) => {
//       if (err) console.log(err);
//     });
//   });

// Get all of the articles by user (author) grumpy19
//   db.query("SELECT * FROM articles WHERE author = 'grumpy19'").then((result) => {
//     fs.writeFile("./output-grumpy19.json", JSON.stringify(result), (err) => {
//       if (err) console.log(err);
//     });
//   });

// Get all of the comments that have more than 10 votes.
  db.query("SELECT * FROM comments WHERE votes > 10").then((result) => {
    fs.writeFile("./output-commments_votes-more-than-10.json", JSON.stringify(result), (err) => {
      if (err) console.log(err);
    });
  });
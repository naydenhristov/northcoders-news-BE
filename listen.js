const app = require("./api");

app.listen(9090, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("server is listening on port 9090");
  }
});
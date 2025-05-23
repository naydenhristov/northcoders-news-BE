exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request!" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "ID Not Found!" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    console.log(err, "<---Custom Error");
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err, "<---Server Error");
  res.status(500).send({ msg: "Internal Server Error" });
};

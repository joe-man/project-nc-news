const express = require("express");
const apiRouter = require("./routes/api-router.js");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err.status === 404) {
    if (!err.msg) err.msg = "Not Found";
    res.status(404).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 400) {
    if (!err.msg) err.msg = "Bad Request";
    res.status(400).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid datatype of input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Missing data for request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: err.detail });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "42703") {
    res.status(400).send({ msg: "Invalid datatype for query" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: err.msg });
});

module.exports = app;

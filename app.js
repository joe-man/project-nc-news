const express = require("express")
const { getTopics } = require("./controllers/topics.controllers")
const { getEndpoints } = require("./controllers/api.controllers")
const { getArticleByArticleID } = require("./controllers/articles.controllers")

const app = express()

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics)
app.get("/api/article/:article_id", getArticleByArticleID)

app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({ msg: "Not Found"})
    } else next(err)
})

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Invalid article ID"})
    } else next(err)
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg :err.msg})
})

module.exports = app
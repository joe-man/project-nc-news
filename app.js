const express = require("express")
const { getTopics } = require("./controllers/topics.controllers")
const { getEndpoints } = require("./controllers/api.controllers")
const { getArticleByArticleID, getArticles, patchArticleByArticleID } = require("./controllers/articles.controllers")
const { getCommentsByArticleID, postCommentByArticleID } = require("./controllers/comments.controllers")

const app = express()

app.use(express.json());

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleByArticleID)
app.patch("/api/articles/:article_id", patchArticleByArticleID)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleID)
app.post("/api/articles/:article_id/comments", postCommentByArticleID)


app.use((err, req, res, next) => {
    if (err.status === 404) {
        if (!err.msg) err.msg = "Not Found"
        res.status(404).send({ msg: err.msg})
    } else next(err)
})

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "Invalid datatype of input"})
    } else next(err)
})

app.use((err, req, res, next) => {
    if (err.code === "23502") {
        res.status(400).send({ msg: "Missing data for request"})
    } else next(err)
})

app.use((err, req, res, next) => {
    if (err.code === "23503") {
        res.status(404).send({ msg: err.detail})
    } else next(err)
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg :err.msg})
})

module.exports = app
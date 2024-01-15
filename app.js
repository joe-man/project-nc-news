const express = require("express")
const { getTopics } = require("./controllers/topics.controllers")
const { getEndpoints } = require("./controllers/api.controllers")

const app = express()

app.get("/api", getEndpoints)
app.get("/api/topics", getTopics)

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg :err.msg})
})

module.exports = app
const express = require("express")
const { getTopics } = require("./controllers/topics.controllers")

const app = express()

app.get("/api/topics", getTopics)

// app.use((err, req, res, next) => {
//     if (err.status === 404) {
//         res.status(404).send({msg: "Not Found"})
//     }
// })

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg :err.msg})
})

module.exports = app
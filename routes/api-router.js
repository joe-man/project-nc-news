const { getEndpoints } = require("../controllers/api.controllers")
const { getTopics } = require("../controllers/topics.controllers")
const articlesRouter = require("./articles-router")
const commentsRouter = require("./comments-router")
const userRouter = require("./users-router")
const apiRouter = require("express").Router()


apiRouter.get("/", getEndpoints)
apiRouter.get("/topics", getTopics)

apiRouter.use("/users", userRouter)
apiRouter.use("/comments", commentsRouter)
apiRouter.use("/articles", articlesRouter)

module.exports = apiRouter
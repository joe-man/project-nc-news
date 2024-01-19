const { getEndpoints } = require("../controllers/api.controllers")
const articlesRouter = require("./articles-router")
const commentsRouter = require("./comments-router")
const topicsRouter = require("./topics-router")
const userRouter = require("./users-router")
const apiRouter = require("express").Router()


apiRouter.get("/", getEndpoints)

apiRouter.use("/topics", topicsRouter)
apiRouter.use("/users", userRouter)
apiRouter.use("/comments", commentsRouter)
apiRouter.use("/articles", articlesRouter)

module.exports = apiRouter
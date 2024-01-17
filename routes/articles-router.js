const { getArticleByArticleID, getArticles, getCommentsByArticleID, postCommentByArticleID, patchArticleByArticleID } = require("../controllers/articles.controllers")

const articlesRouter = require("express").Router()

articlesRouter
.route("/")
.get(getArticles)

articlesRouter
.route("/:article_id")
.get(getArticleByArticleID)
.patch(patchArticleByArticleID)

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticleID)
.post(postCommentByArticleID)

module.exports = articlesRouter
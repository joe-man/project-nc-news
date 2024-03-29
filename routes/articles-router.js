const { getArticleByArticleID, getArticles, getCommentsByArticleID, postCommentByArticleID, patchArticleByArticleID, postArticle, deleteArticleController } = require("../controllers/articles.controllers")

const articlesRouter = require("express").Router()

articlesRouter
.route("/")
.get(getArticles)
.post(postArticle)

articlesRouter
.route("/:article_id")
.get(getArticleByArticleID)
.patch(patchArticleByArticleID)
.delete(deleteArticleController)

articlesRouter
.route("/:article_id/comments")
.get(getCommentsByArticleID)
.post(postCommentByArticleID)

module.exports = articlesRouter
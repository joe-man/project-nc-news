const { selectCommentsByArticleID, insertCommentByArticleID } = require("../models/comments.models")

exports.getCommentsByArticleID = (req, res, next) => {
    const {article_id} = req.params
    selectCommentsByArticleID(article_id)
    .then(({rows: comments}) => {
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.postCommentByArticleID = (req, res, next) => {
    const {article_id} = req.params
    const {username, body} = req.body
    const comment = [username, body, article_id]
    insertCommentByArticleID(comment)
    .then(({rows: [comment]}) => {
        res.status(201).send({comment})
    })
    .catch(err => {
        next(err)
    })
}
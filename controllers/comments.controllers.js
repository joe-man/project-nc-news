const { selectCommentsByArticleID } = require("../models/comments.models")

exports.getCommentsByArticleID = (req, res, next) => {
    const {article_id} = req.params
    selectCommentsByArticleID(article_id)
    .then(({rows: comments}) => {
        res.status(200).send({comments})
    })
    .catch(next)
}
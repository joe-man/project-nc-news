const {deleteFromComment} = require("../models/comments.models.js")

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    deleteFromComment(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}
const {deleteFromComment, updateComment} = require("../models/comments.models.js")

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    deleteFromComment(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
}

exports.patchComment = (req, res, next) => {
    const {comment_id} = req.params
    const {inc_votes} = req.body
    updateComment(comment_id, inc_votes)
    .then(({rows: [comment]}) => {
        res.status(200).send({comment})
    })
    .catch(next)
}
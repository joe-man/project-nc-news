const db = require("../db/connection.js")
const format = require("pg-format")

exports.deleteFromComment = (comment_id) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    `, [comment_id])
    .then(({rowCount}) => {
        if (rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Resource not found"})
        }
    })
}

exports.updateComment = (comment_id, inc_votes) => {
    return db.query(`
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *
    `, [inc_votes, comment_id])
    .then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({status: 404, msg: `Comment ID '${comment_id}' does not exist`})
        }
        return res
    })
}
const db = require("../db/connection.js")
const format = require("pg-format")

exports.selectCommentsByArticleID = (article_id) => {
    return db.query(`
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at desc
    `, [article_id])
    .then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({
                status: 404
            })
        }
        return res
    })
}

exports.insertCommentByArticleID = (comment) => {
    return db.query(format(`
    INSERT INTO comments
    (author, body, article_id)
    VALUES %L RETURNING *
    `, [comment]))
}
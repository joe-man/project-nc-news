const db = require("../db/connection.js")
const format = require("pg-format")
const { sort } = require("../db/data/test-data/articles.js")

exports.selectArticleByID = (article_id) => {
    return db.query(`
    SELECT a.*, COUNT(c.comment_id) comment_count
    FROM articles a
    LEFT OUTER JOIN comments c on c.article_id = a.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id
    `, [article_id])
    .then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({
                status: 404,
            })
        }
        return res
    })
}

exports.selectArticles = (topic, sort_by = "created_at", order = "desc") => {
    const validSortBy = ["article_id", "title", "topic", "author", "created_at", "votes", "article_img_url"]
    const validOrder = ["ASC", "asc", "DESC", "desc"]
    if (!validSortBy.includes(sort_by)) {return Promise.reject({ status: 400, msg: "Invalid column for sorting"})}
    if (!validOrder.includes(order)) {return Promise.reject({ status: 400, msg: "Invalid sorting order"})}

    const parameters = []

    let query = "SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles"
    if (topic) {
        query += ` WHERE topic = $1`
        parameters.push(topic)
    }
    query += ` ORDER BY ${sort_by} ${order}` 

    return db.query(query, parameters)
}

exports.updateArticleByArticleID = (article_id, inc_votes) => {
    return db.query(`
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
    `, [inc_votes, article_id])
    .then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article with this ID was not found"})
        }
        return res
    })
}

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
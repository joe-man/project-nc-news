const db = require("../db/connection.js")

exports.selectArticleByID = (article_id) => {
    return db.query(`
    SELECT * FROM articles
    WHERE article_id = $1
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

exports.selectArticles = () => {
    return db.query(`
    SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles
    ORDER BY created_at desc
    `)
}
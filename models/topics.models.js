const db = require("../db/connection.js")
const format = require("pg-format")

exports.selectTopics = () => {
    return db.query(`
    SELECT * FROM topics
    `)
}

exports.insertTopic = (topic) => {
    if (topic.includes(undefined)) return Promise.reject({status:400, msg: "Please ensure your request body includes 'slug' and 'description'"})
    return db.query(format(`
    INSERT INTO topics
    (slug, description)
    VALUES
    %L
    RETURNING *
    `, [topic]))
}
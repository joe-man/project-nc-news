const db = require("../db/connection.js")

exports.selectUsers = () => {
    return db.query(`
    SELECT * FROM users
    `)
}

exports.selectUserByUsername = (username) => {
    return db.query(`
    SELECT * FROM users
    WHERE username = $1
    `, [username])
    .then((res) => {
        if (res.rows.length === 0) {
            return Promise.reject({status: 404, msg: `User by '${username}' was not found`})
        }
        return res
    })
}
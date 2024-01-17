const { selectUsers, selectUserByUsername } = require("../models/users.models")

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then(({rows: users}) => {
        res.status(200).send({users})
    })
    .catch(err => {
        next(err)
    })
}

exports.getUserByUsername = (req, res, next) => {
    const {username} = req.params
    selectUserByUsername(username)
    .then(({rows: [user]}) => {
        res.status(200).send({user})
    })
    .catch(next)
}
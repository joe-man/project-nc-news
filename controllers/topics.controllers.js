const { selectTopics, insertTopic } = require("../models/topics.models")

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then(({rows: topics}) => {
        res.status(200).send({topics})
    })
    .catch(next)
}

exports.postTopic = (req, res, next) => {
    const {slug, description} = req.body
    const topic = [slug, description]
    insertTopic(topic)
    .then(({rows: [topic]}) => {
        res.status(201).send({topic})
    })
    .catch(next)
}
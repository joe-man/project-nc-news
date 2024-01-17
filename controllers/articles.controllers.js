const { checkColumnExists } = require("../db/seeds/utils")
const { selectArticles, selectArticleByID, updateArticleByArticleID, selectCommentsByArticleID, insertCommentByArticleID  } = require("../models/articles.models")

exports.getArticleByArticleID = ((req, res, next)=> {
    const {article_id} = req.params
    selectArticleByID(article_id)
    .then(({rows: [article]}) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
})

exports.getArticles = ((req, res, next) => {
    const {topic, sort_by, order} = req.query
    const query = [selectArticles(topic, sort_by, order)]
    if (topic) {
        const topicExists = checkColumnExists("topics", "slug", topic)
        query.push(topicExists)
    }
    Promise.all(query)
    .then(([{rows: articles}]) => {
        res.status(200).send({articles})
    })
    .catch(next)
})

exports.patchArticleByArticleID = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    updateArticleByArticleID(article_id, inc_votes)
    .then(({rows: [article]}) => {
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getCommentsByArticleID = (req, res, next) => {
    const {article_id} = req.params
    selectCommentsByArticleID(article_id)
    .then(({rows: comments}) => {
        res.status(200).send({comments})
    })
    .catch(next)
}

exports.postCommentByArticleID = (req, res, next) => {
    const {article_id} = req.params
    const {username, body} = req.body
    const comment = [username, body, article_id]
    insertCommentByArticleID(comment)
    .then(({rows: [comment]}) => {
        res.status(201).send({comment})
    })
    .catch(err => {
        next(err)
    })
}
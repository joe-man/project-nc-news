const { checkColumnExists } = require("../db/seeds/utils")
const { selectArticles, selectArticleByID, updateArticleByArticleID, selectCommentsByArticleID, insertCommentByArticleID, insertArticle  } = require("../models/articles.models")

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
    let {topic, sort_by, order, limit, p} = req.query
    if ((req.query.hasOwnProperty("limit") && req.query.limit === "")) limit = 10 // ?limit defaults to 10
   
    if (p) {
        if (!limit) limit = 10
        p = (p - 1) * limit
    }

    const query = [selectArticles(topic, sort_by, order, limit, p)]

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

exports.postArticle = (req, res, next) => {
    const article = req.body
    insertArticle(article)
    .then(({rows: [article]}) => {
        res.status(201).send({article})
    })
    .catch(next)
}
const { selectArticles, selectArticleByID } = require("../models/articles.models")

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
    selectArticles()
    .then(({rows: articles}) => {
        res.status(200).send({articles})
    })
    .catch(next)
})
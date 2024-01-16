const { selectArticles, selectArticleByID, updateArticleByArticleID } = require("../models/articles.models")

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

exports.patchArticleByArticleID = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    updateArticleByArticleID(article_id, inc_votes)
    .then(({rows: [article]}) => {
        res.status(200).send({article})
    })
    .catch(next)
}
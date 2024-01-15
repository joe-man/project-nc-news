const data = require("../db/data/test-data")
const request = require("supertest")
const app = require("../app.js")
const seed = require("../db/seeds/seed.js")
const db = require("../db/connection.js")
const toBeSorted = require("jest-sorted")

afterAll(()=>{
    return db.end();
})

beforeEach(()=>{
    return seed(data);
})

describe("GET", () => {
    describe("/api/topics", () => {
        test("200 - returns all topics each with a slug and description property", () => {
            return request(app)
            .get("/api/topics")
            .expect(200)
            .then(({body: {topics}}) => {
                expect(topics.length).toBe(3)
                topics.forEach(topic => {
                    expect(typeof topic.slug).toBe("string")
                    expect(typeof topic.description).toBe("string")
                })
            })
        })
        test("404 - when invalid endpoint is given", () => {
            return request(app)
            .get("/api/dragons")
            .expect(404)
            .then(({statusCode}) => {
                expect(statusCode).toBe(404)
            })
        })
    })
    describe("/api", () => {
        test("200 - returns correct an object with nested objects which have 4 correct properties with the correct datatype", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({body: {endpoints}}) => {
                for (let key in endpoints) {
                    const innerObject = endpoints[key]
                    expect(Object.keys(innerObject).length).toBe(4)
                    expect(typeof innerObject.description).toBe("string")
                    expect(Array.isArray(innerObject.queries)).toBe(true)
                    expect(typeof innerObject.formatRequestBody).toBe("string")
                    expect(typeof innerObject.exampleResponse).toBe("object")
                }
            })
        })
    })
    describe("/api/articles/:article_id", () => {
        test("200 - returns single article by article id", () => {
            return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({body: {article}}) => {
                expect(Object.keys(article).length).toBe(8)
                expect(article.article_id).toBe(1)
                expect(article.title).toBe("Living in the shadow of a great man")
                expect(article.topic).toBe("mitch")
                expect(article.author).toBe("butter_bridge")
                expect(article.body).toBe("I find this existence challenging")
                expect(article.created_at).toBe("2020-07-09T20:11:00.000Z")
                expect(article.votes).toBe(100)
                expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
            })
        })
        test("404 - for valid but non existent article ID", () => {
            return request(app)
            .get("/api/articles/999")
            .expect(404)
            .then(({body: {msg}}) => {
               expect(msg).toBe("Not Found")
            })
        })
        test("404 - for invalid article ID", () => {
            return request(app)
            .get("/api/articles/dragons")
            .expect(400)
            .then(({body: {msg}}) => {
               expect(msg).toBe("Invalid datatype of input")
            })
        })
    })
    describe("/api/articles", () => {
        test("200 - returns all articles with correct number of columns and rows and datatypes in descending order", () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(13)
                expect(articles).toBeSortedBy("created_at", {descending: true})
                articles.forEach(article => {
                    expect(Object.keys(article).length).toBe(7)
                    expect(typeof article.article_id).toBe("number")
                    expect(typeof article.title).toBe("string")
                    expect(typeof article.topic).toBe("string")
                    expect(typeof article.author).toBe("string")
                    expect(typeof article.created_at).toBe("string")
                    expect(typeof article.votes).toBe("number")
                    expect(typeof article.article_img_url).toBe("string")
                    expect(article.hasOwnProperty("body")).toBe(false)
                })
            })
        })
    })
    describe("/api/article/:article_id/comments", () => {
        test("200 - returns all comments for an article", () => {
            return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments).toBeSortedBy("created_at", {descending: true})
                expect(comments.length).toBe(11)
                comments.forEach(comment => {
                    expect(Object.keys(comment).length).toBe(6)
                    expect(typeof comment.comment_id).toBe("number")
                    expect(typeof comment.votes).toBe("number")
                    expect(typeof comment.created_at).toBe("string")
                    expect(typeof comment.author).toBe("string")
                    expect(typeof comment.created_at).toBe("string")
                    expect(typeof comment.body).toBe("string")
                    expect(typeof comment.article_id).toBe("number")
                })
            })
        })
        test("404 - when provided a non existent article ID", () => {
            return request(app)
            .get("/api/articles/999/comments")
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Not Found")
            })
        })
        test("400 - when provided an invalid article ID", () => {
            return request(app)
            .get("/api/articles/dragons/comments")
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid datatype of input")
            })
        })
    })
})
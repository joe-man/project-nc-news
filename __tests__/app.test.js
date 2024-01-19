const data = require("../db/data/test-data")
const request = require("supertest")
const app = require("../app.js")
const seed = require("../db/seeds/seed.js")
const db = require("../db/connection.js")
const toBeSortedBy = require("jest-sorted")

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
                    expect(typeof innerObject.formatRequestBody).toBe("object")
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
                expect(Object.keys(article).length).toBe(9)
                expect(article.article_id).toBe(1)
                expect(article.title).toBe("Living in the shadow of a great man")
                expect(article.topic).toBe("mitch")
                expect(article.author).toBe("butter_bridge")
                expect(article.body).toBe("I find this existence challenging")
                expect(comment.hasOwnProperty(created_at)).toBe(true)
                expect(article.votes).toBe(100)
                expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
                expect(article.comment_count).toBe("11")
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
    })
    describe("/api/articles", () => {
        test("200 - returns all articles with correct number of columns and rows and datatypes in descending order", () => {
            return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({body: {articles, msg}}) => {
                expect(articles.length).toBe(13)
                expect(articles).toBeSortedBy("created_at", {descending: true})
                articles.forEach(article => {
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
        test("200 - returns all articles with mitch topics", () => {
            return request(app)
            .get("/api/articles?topic=mitch")
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(12)
                expect(articles).toBeSortedBy("created_at", {descending: true})
                articles.forEach(article => {
                    expect(article.topic).toBe("mitch")
                    expect(typeof article.article_id).toBe("number")
                    expect(typeof article.title).toBe("string")
                    expect(typeof article.author).toBe("string")
                    expect(typeof article.created_at).toBe("string")
                    expect(typeof article.votes).toBe("number")
                    expect(typeof article.article_img_url).toBe("string")
                    expect(article.hasOwnProperty("body")).toBe(false)
                })
            })
        })
        test("200 - returns all articles with cats topics", () => {
            return request(app)
            .get("/api/articles?topic=cats")
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(1)
                expect(articles).toBeSortedBy("created_at", {descending: true})
                articles.forEach(article => {
                    expect(article.topic).toBe("cats")
                    expect(typeof article.article_id).toBe("number")
                    expect(typeof article.title).toBe("string")
                    expect(typeof article.author).toBe("string")
                    expect(typeof article.created_at).toBe("string")
                    expect(typeof article.votes).toBe("number")
                    expect(typeof article.article_img_url).toBe("string")
                    expect(article.hasOwnProperty("body")).toBe(false)
                })
            })
        })
        test("200 - returns all articles with paper topics", () => {
            return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(0)
            })
        })
        test("404 - when non existent topic is given", () => {
            return request(app)
            .get("/api/articles?topic=dragons")
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Resource not found")
            })
        })
        test("200 - returns articles sorted by votes column and asc", () => {
            return request(app)
            .get("/api/articles?sort_by=votes&order=asc")
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(13)
                expect(articles).toBeSortedBy("votes", {descending: false})
                articles.forEach(article => {
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
        test("200 - returns articles sorted by title column and asc", () => {
            return request(app)
            .get("/api/articles?sort_by=title&order=desc")
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(13)
                expect(articles).toBeSortedBy("title", {descending: true})
                articles.forEach(article => {
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
        test("400 - when given a sort by parameter which doesn't exist", () => {
            return request(app)
            .get("/api/articles?sort_by=baby&order=asc")
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid column for sorting")
            })
        })
        test("400 - when given an order parameter which doesn't exist", () => {
            return request(app)
            .get("/api/articles?sort_by=votes&order=des")
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid sorting order")
            })
        })
        test("200 - returned default limit of 10 when limit query is used", () => {
            return request(app)
            .get("/api/articles?limit")
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(10)
                expect(articles).toBeSortedBy("created_at", {descending: true})
                articles.forEach(article => {
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
        test("200 - returned specified limit of 5 when limit query is used", () => {
            return request(app)
            .get("/api/articles?limit=5")
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(5)
                expect(articles).toBeSortedBy("created_at", {descending: true})
                articles.forEach(article => {
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
        test("200 - returned all articles when limit is higher than max articles", () => {
            return request(app)
            .get("/api/articles?limit=20")
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(13)
                expect(articles).toBeSortedBy("created_at", {descending: true})
                articles.forEach(article => {
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
        test("400 - when invalid datatype input is given", () => {
            return request(app)
            .get("/api/articles?limit=one")
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid datatype for query")
            })
        })
        test("200 - returned articles when p page is defined, limit default to 10 when not specified", () => {
            return request(app)
            .get("/api/articles?sort_by=article_id&&order=asc&p=1")
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(10)
                expect(articles).toBeSortedBy("article_id", {descending: false})
                expect(articles[0].title).toBe("Living in the shadow of a great man")
            })
        })
        test("200 - returned articles when p page is defined at 2, limit default to 10 when not specified", () => {
            return request(app)
            .get("/api/articles?sort_by=article_id&&order=asc&p=2")
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(3)
                expect(articles).toBeSortedBy("article_id", {descending: false})
                expect(articles[2].title).toBe("Another article about Mitch")
            })
        })
        test("200 - returned articles when p page is defined at 2, limit set at 5", () => {
            return request(app)
            .get("/api/articles?sort_by=article_id&&order=asc&limit=5&p=2")
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(5)
                expect(articles).toBeSortedBy("article_id", {descending: false})
                expect(articles[0].article_id).toBe(6)
            })
        })
        test("400 - when p is not a number", () => {
            return request(app)
            .get("/api/articles?sort_by=article_id&&order=asc&limit=5&p=two")
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid datatype for query")
            })
        })
        test("200 - should return a total_count property with the number of articles returned", () => {
            return request(app)
            .get("/api/articles?sort_by=article_id&&order=asc&limit=5&p=2")
            .expect(200)
            .then(({body: {articles}}) => {
                expect(articles.length).toBe(5)
                expect(articles[0].total_count).toBe(5)
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
                comments.forEach(comment => {
                    expect(Object.keys(comment).length).toBe(6)
                    expect(typeof comment.comment_id).toBe("number")
                    expect(typeof comment.votes).toBe("number")
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
        test("200 - return default of 10 responses", () => {
            return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments.length).toBe(10)
            })
        })
        test("200 - return specified number of responses", () => {
            return request(app)
            .get("/api/articles/1/comments?limit=5")
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments.length).toBe(5)
            })
        })
        test("200 - return specified number of responses from the next page", () => {
            return request(app)
            .get("/api/articles/1/comments?limit=10&p=2")
            .expect(200)
            .then(({body: {comments}}) => {
                expect(comments.length).toBe(1)
            })
        })
        test("400 - when not a number is given to limit query", () => {
            return request(app)
            .get("/api/articles/1/comments?limit=one")
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid datatype for query")
            })
        })
        test("400 - when not a number is given to p query", () => {
            return request(app)
            .get("/api/articles/1/comments?p=two")
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid datatype for query")
            })
        })
    })
    describe("/api/users", () => {
        test("200 - returns all users", () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({body: {users}}) => {
                expect(users.length).toBe(4)
                users.forEach(user => {
                    expect(Object.keys(user).length).toBe(3)
                    expect(typeof user.username).toBe("string")
                    expect(typeof user.name).toBe("string")
                    expect(typeof user.avatar_url).toBe("string")
                })
            })
        })
    })
    describe("/api/users/:username", () => {
        test("200 - returns a user by username", () => {
            return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({body: {user}}) => {
                expect(Object.keys(user).length).toBe(3)
                expect(user.username).toBe("lurker")
                expect(user.name).toBe("do_nothing")
                expect(user.avatar_url).toBe('https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png')
            })
        })
        test("404 - when input username is not found", () => {
            return request(app)
            .get('/api/users/beanbag')
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe("User by 'beanbag' was not found")
            })
        })
    })
})

describe("POST", () => {
    describe("/api/articles/:article_id/comments", () => {
        test("201 - returns the posted comment which contains username and body properties, unnecessary keys are ignored", () => {
            return request(app)
            .post("/api/articles/1/comments")
            .send({
                username: "butter_bridge",
                body: "This movie deserves 5 gigantic stars",
                votes: 100
            })
            .expect(201)
            .then(({body: {comment}}) => {
                expect(Object.keys(comment).length).toBe(6)
                expect(comment.comment_id).toBe(19)
                expect(comment.votes).toBe(0)
                expect(comment.created_at.slice(0,10)).toBe(new Date().toJSON().slice(0,10))
                expect(comment.author).toBe("butter_bridge")
                expect(comment.body).toBe("This movie deserves 5 gigantic stars")
                expect(comment.article_id).toBe(1)
            })
        })
        test("400 - when the body does only contains username", () => {
            return request(app)
            .post("/api/articles/1/comments")
            .send({
                username: "butter_bridge"
            })
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Missing data for request")
            })
        })
        test("400 - when the body does only contains body", () => {
            return request(app)
            .post("/api/articles/1/comments")
            .send({
                body: "This movie deserves 5 gigantic stars"
            })
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Missing data for request")
            })
        })
        test("404 - when provided a non existent article ID", () => {
            return request(app)
            .post("/api/articles/999/comments")
            .send({
                username: "butter_bridge",
                body: "This movie deserves 5 gigantic stars",
                votes: 5
            })
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Key (article_id)=(999) is not present in table \"articles\".")
            })
        })
        test("400 - when provided an invalid article ID", () => {
            return request(app)
            .post("/api/articles/dragons/comments")
            .send({
                username: "butter_bridge",
                body: "This movie deserves 5 gigantic stars",
                votes: 5
            })
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid datatype of input")
            })
        })
        test("404 - when provided a username which does not exist", () => {
            return request(app)
            .post("/api/articles/1/comments")
            .send({
                username: "movie_lover_999",
                body: "This movie deserves 5 gigantic stars",
            })
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Key (author)=(movie_lover_999) is not present in table \"users\".")
            })
        })
    })
    describe("/api/articles", () => {
        test("201 - returns the created article object", () => {
            return request(app)
            .post("/api/articles")
            .send({
                author: "icellusedkars",
                title: "How to cell bad products",
                body: "Hide the defects",
                topic: "mitch",
                article_img_url: "https://fakeurl"
            })
            .expect(201)
            .then(({body: {article}}) => {
                expect(Object.keys(article).length).toBe(9)
                expect(article.author).toBe("icellusedkars")
                expect(article.title).toBe("How to cell bad products")
                expect(article.body).toBe("Hide the defects")
                expect(article.topic).toBe("mitch")
                expect(article.article_img_url).toBe("https://fakeurl")
                expect(article.article_id).toBe(14)
                expect(article.votes).toBe(0)
                expect(article.created_at.slice(0,10)).toBe(new Date().toJSON().slice(0,10))
                expect(article.comment_count).toBe(0)
            })
        })
        test("201 - returns object with default article url if not provided", () => {
            return request(app)
            .post("/api/articles")
            .send({
                author: "icellusedkars",
                title: "How to cell bad products",
                body: "Hide the defects",
                topic: "mitch"
            })
            .expect(201)
            .then(({body: {article}}) => {
                expect(Object.keys(article).length).toBe(9)
                expect(article.author).toBe("icellusedkars")
                expect(article.title).toBe("How to cell bad products")
                expect(article.body).toBe("Hide the defects")
                expect(article.topic).toBe("mitch")
                expect(article.article_img_url).toBe('https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700')
                expect(article.article_id).toBe(14)
                expect(article.votes).toBe(0)
                expect(article.created_at.slice(0,10)).toBe(new Date().toJSON().slice(0,10))
                expect(article.comment_count).toBe(0)
            })
        })
        test("400 - when missing any of the other mandatory properties", () => {
            return request(app)
            .post("/api/articles")
            .send({
                author: "icellusedkars",
                title: "How to cell bad products",
                body: "Hide the defects",
            })
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Missing data for request")
            })
        })
        test("404 - when topic provided does not exist", () => {
            return request(app)
            .post("/api/articles")
            .send({
                author: "icellusedkars",
                title: "How to cell bad products",
                body: "Hide the defects",
                topic: "dragons"
            })
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Key (topic)=(dragons) is not present in table \"topics\".")
            })
        })
        test("404 - when author provided does not exist", () => {
            return request(app)
            .post("/api/articles")
            .send({
                author: "joe man",
                title: "How to cell bad products",
                body: "Hide the defects",
                topic: "mitch"
            })
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Key (author)=(joe man) is not present in table \"users\".")
            })
        })
    })
    describe("/api/topics", () => {
        test("201 - creates a new topic and returns with the newly added topic", () => {
            return request(app)
            .post("/api/topics")
            .send({
                slug: "new topics",
                description: "This is a new topic"
            })
            .expect(201)
            .then(({body: {topic}}) => {
                expect(topic.slug).toBe("new topics")
                expect(topic.description).toBe("This is a new topic")
            })
        })
        test("400 - when one of the mandatory keys are not provided", () => {
            return request(app)
            .post("/api/topics")
            .send({
                slug: "new topics",
            }) 
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Please ensure your request body includes 'slug' and 'description'")
            })
        })
    })
})

describe("PATCH", () => {
    describe("/api/articles/:article_id", () => {
        test("200 - returns updated object indicating a successful patch", () => {
            return request(app)
            .patch("/api/articles/1")
            .send({
                inc_votes: -50
            })
            .expect(200)
            .then(({body: {article}}) => {
                expect(Object.keys(article).length).toBe(8)
                expect(article.article_id).toBe(1)
                expect(article.title).toBe("Living in the shadow of a great man")
                expect(article.topic).toBe("mitch")
                expect(article.author).toBe("butter_bridge")
                expect(article.body).toBe("I find this existence challenging")
                expect(comment.hasOwnProperty(created_at)).toBe(true)
                expect(article.votes).toBe(50)
                expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
            })
        })
        test("400 - when invalid value is given for votes input", () => {
            return request(app)
            .patch("/api/articles/1")
            .send({
                inc_votes: "one"
            })
            .expect(400)
            .then(({body: {msg}}) => {
               expect(msg).toBe("Invalid datatype of input")
            })
        })
        test("400 - when inc_votes is missing", () => {
            return request(app)
            .patch("/api/articles/1")
            .send({
                inc_vote: 1
            })
            .expect(400)
            .then(({body: {msg}}) => {
               expect(msg).toBe("Missing data for request")
            })
        })
        test("404 - when article ID does not exist", () => {
            return request(app)
            .patch("/api/articles/999")
            .send({
                inc_votes: 1
            })
            .expect(404)
            .then(({body: {msg}}) => {
               expect(msg).toBe("Article with this ID was not found")
            })
        })
        test("400 - when article ID is invalid", () => {
            return request(app)
            .patch("/api/articles/dragons")
            .send({
                inc_votes: 1
            })
            .expect(400)
            .then(({body: {msg}}) => {
               expect(msg).toBe("Invalid datatype of input")
            })
        })
    })
    describe("/api/comments/:comment_id", () => {
        test("200 - returns the updated object with votes incremented", () => {
            return request(app)
            .patch("/api/comments/1")
            .send({
                inc_votes: 10
            })
            .expect(200)
            .then(({body: {comment}}) => {
                expect(Object.keys(comment).length).toBe(6)
                expect(comment.comment_id).toBe(1)
                expect(comment.body).toBe("Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!")
                expect(comment.votes).toBe(26)
                expect(comment.author).toBe("butter_bridge")
                expect(comment.article_id).toBe(9)
                expect(comment.hasOwnProperty(created_at)).toBe(true)
            })
        })
        test("404 - when comment id does not exist", () => {
            return request(app)
            .patch("/api/comments/999")
            .send({
                inc_votes: 10
            })
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Comment ID '999' does not exist")
            })
        })
        test("400 - when comment id is invalid", () => {
            return request(app)
            .patch("/api/comments/one")
            .send({
                inc_votes: 10
            })
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid datatype of input")
            })
        })
        test("400 - inc_votes is not included in the input object", () => {
            return request(app)
            .patch("/api/comments/1")
            .send({
                inc_vot: 10
            })
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Missing data for request")
            })
        })
        test("400 - wrong datatype for inc_votes value", () => {
            return request(app)
            .patch("/api/comments/1")
            .send({
                inc_votes: "ten"
            })
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid datatype of input")
            })
        })
    })
})

describe("DELETE", () => {
    describe("/api/comments/:comment_id", () => {
        test("204 - responds with no content on success", () => {
            return request(app)
            .delete("/api/comments/1")
            .expect(204)
        })
        test("404 - when non-existent id given", () => {
            return request(app)
            .delete("/api/comments/999")
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Resource not found")
            })
        })
        test("400 - when invalid id given", () => {
            return request(app)
            .delete("/api/comments/dragons")
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid datatype of input")
            })
        })
    })
})
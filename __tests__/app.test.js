const data = require("../db/data/test-data")
const request = require("supertest")
const app = require("../app.js")
const seed = require("../db/seeds/seed.js")
const db = require("../db/connection.js")

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
            .then(({body: object}) => {
                for (let key in object) {
                    const innerObject = object[key]
                    expect(Object.keys(innerObject).length).toBe(4)
                    expect(typeof innerObject.description).toBe("string")
                    expect(Array.isArray(innerObject.queries)).toBe(true)
                    expect(typeof innerObject.formatRequestBody).toBe("string")
                    expect(typeof innerObject.exampleResponse).toBe("object")
                }
            })
        })
    })
})
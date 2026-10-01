const request = require("supertest");
const app = require("../app");

describe("Internship API - Production Tests", () => {

    test("GET / should return API information", async () => {

        const response = await request(app)
            .get("/");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message)
            .toBe("Internship REST API is running");

    });


    test("GET /health should return healthy status", async () => {

        const response = await request(app)
            .get("/health");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("healthy");
        expect(response.body.database).toBe("connected");

    });


    test("GET internships should return successful response", async () => {

        const response = await request(app)
            .get("/api/internships");

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.pagination).toBeDefined();

    });


    test("Invalid internship should return 400", async () => {

        const response = await request(app)
            .post("/api/internships")
            .send({
                title: ""
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error)
            .toBe("Validation failed");

    });


    test("Non-existing internship should return 404", async () => {

        const response = await request(app)
            .get("/api/internships/INT-DOES-NOT-EXIST");

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);

    });


    test("Unknown endpoint should return 404", async () => {

        const response = await request(app)
            .get("/unknown-endpoint");

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);

    });

});
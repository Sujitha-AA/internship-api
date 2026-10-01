const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const db = require("./database");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// ==========================================
// PRODUCTION CONFIGURATION
// ==========================================

app.disable("x-powered-by");

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(helmet());

app.use(cors());

app.use(express.json({ limit: "100kb" }));

// ==========================================
// RATE LIMITING
// ==========================================

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
        success: false,
        error: "Too many requests. Please try again later."
    }
});

app.use("/api", apiLimiter);

// ==========================================
// REQUEST LOGGING
// ==========================================

app.use((req, res, next) => {

    const start = Date.now();

    res.on("finish", () => {

        const duration = Date.now() - start;

        console.log(
            `[${new Date().toISOString()}] ` +
            `${req.method} ${req.originalUrl} ` +
            `${res.statusCode} - ${duration}ms`
        );

    });

    next();
});

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Internship REST API is running",
        version: "1.0.0",

        endpoints: {
            health: "GET /health",
            list: "GET /api/internships",
            detail: "GET /api/internships/:id",
            create: "POST /api/internships",
            update: "PUT /api/internships/:id",
            delete: "DELETE /api/internships/:id"
        }
    });

});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/health", (req, res) => {

    db.get(
        "SELECT 1 AS database_ok",
        [],
        (error, result) => {

            if (error) {

                console.error(
                    "Health check database error:",
                    error.message
                );

                return res.status(503).json({
                    status: "unhealthy",
                    service: "Internship REST API",
                    database: "unavailable"
                });

            }

            res.status(200).json({
                status: "healthy",
                service: "Internship REST API",
                database: "connected",
                timestamp: new Date().toISOString()
            });

        }
    );

});

// ==========================================
// VALIDATION FUNCTION
// ==========================================

function validateInternship(data) {

    const errors = [];

    if (!data || typeof data !== "object") {

        return ["Request body must be a JSON object"];

    }

    if (
        typeof data.title !== "string" ||
        data.title.trim() === ""
    ) {

        errors.push("title is required");

    }

    if (
        typeof data.domain !== "string" ||
        data.domain.trim() === ""
    ) {

        errors.push("domain is required");

    }

    if (
        typeof data.mode !== "string" ||
        data.mode.trim() === ""
    ) {

        errors.push("mode is required");

    }

    if (
        typeof data.location !== "string" ||
        data.location.trim() === ""
    ) {

        errors.push("location is required");

    }

    if (!Array.isArray(data.skills)) {

        errors.push("skills must be an array");

    } else if (data.skills.length === 0) {

        errors.push(
            "skills must contain at least one skill"
        );

    } else if (
        !data.skills.every(
            skill =>
                typeof skill === "string" &&
                skill.trim() !== ""
        )
    ) {

        errors.push(
            "skills must contain valid text values"
        );

    }

    if (
        data.openings === undefined ||
        data.openings === null
    ) {

        errors.push("openings is required");

    } else if (
        !Number.isInteger(data.openings) ||
        data.openings < 0
    ) {

        errors.push(
            "openings must be a non-negative integer"
        );

    }

    return errors;
}

// ==========================================
// GET ALL INTERNSHIPS
// PAGINATION
// ==========================================

app.get("/api/internships", (req, res, next) => {

    let page = parseInt(req.query.page) || 1;

    let limit = parseInt(req.query.limit) || 5;

    if (page < 1) {
        page = 1;
    }

    if (limit < 1) {
        limit = 5;
    }

    if (limit > 50) {
        limit = 50;
    }

    const offset = (page - 1) * limit;

    db.get(
        "SELECT COUNT(*) AS total FROM internships",
        [],
        (countError, countResult) => {

            if (countError) {

                return next(countError);

            }

            db.all(
                `
                SELECT *
                FROM internships
                ORDER BY id
                LIMIT ?
                OFFSET ?
                `,
                [limit, offset],

                (error, rows) => {

                    if (error) {

                        return next(error);

                    }

                    try {

                        const internships = rows.map(row => ({

                            id: row.id,
                            title: row.title,
                            domain: row.domain,
                            mode: row.mode,
                            location: row.location,
                            skills: JSON.parse(row.skills),
                            openings: row.openings

                        }));

                        const total = countResult.total;

                        const totalPages =
                            Math.ceil(total / limit);

                        res.status(200).json({

                            success: true,

                            data: internships,

                            pagination: {
                                page,
                                limit,
                                total,
                                totalPages
                            }

                        });

                    } catch (parseError) {

                        next(parseError);

                    }

                }
            );

        }
    );

});

// ==========================================
// GET ONE INTERNSHIP
// ==========================================

app.get("/api/internships/:id", (req, res, next) => {

    const id = req.params.id;

    db.get(
        "SELECT * FROM internships WHERE id = ?",
        [id],

        (error, row) => {

            if (error) {

                return next(error);

            }

            if (!row) {

                return res.status(404).json({

                    success: false,
                    error: "Internship not found"

                });

            }

            try {

                res.status(200).json({

                    success: true,

                    data: {

                        id: row.id,
                        title: row.title,
                        domain: row.domain,
                        mode: row.mode,
                        location: row.location,
                        skills: JSON.parse(row.skills),
                        openings: row.openings

                    }

                });

            } catch (parseError) {

                next(parseError);

            }

        }
    );

});

// ==========================================
// CREATE INTERNSHIP
// ==========================================

app.post("/api/internships", (req, res, next) => {

    const data = req.body;

    const errors =
        validateInternship(data);

    if (errors.length > 0) {

        return res.status(400).json({

            success: false,
            error: "Validation failed",
            details: errors

        });

    }

    const id =
        "INT-" + Date.now();

    const sql = `
        INSERT INTO internships
        (
            id,
            title,
            domain,
            mode,
            location,
            skills,
            openings
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,

        [
            id,
            data.title.trim(),
            data.domain.trim(),
            data.mode.trim(),
            data.location.trim(),
            JSON.stringify(
                data.skills.map(skill => skill.trim())
            ),
            data.openings
        ],

        function (error) {

            if (error) {

                return next(error);

            }

            res.status(201).json({

                success: true,

                message:
                    "Internship created successfully",

                data: {

                    id,
                    title: data.title.trim(),
                    domain: data.domain.trim(),
                    mode: data.mode.trim(),
                    location: data.location.trim(),
                    skills: data.skills,
                    openings: data.openings

                }

            });

        }
    );

});

// ==========================================
// UPDATE INTERNSHIP
// ==========================================

app.put("/api/internships/:id", (req, res, next) => {

    const id = req.params.id;

    const data = req.body;

    const errors =
        validateInternship(data);

    if (errors.length > 0) {

        return res.status(400).json({

            success: false,
            error: "Validation failed",
            details: errors

        });

    }

    db.get(
        "SELECT * FROM internships WHERE id = ?",
        [id],

        (findError, row) => {

            if (findError) {

                return next(findError);

            }

            if (!row) {

                return res.status(404).json({

                    success: false,
                    error: "Internship not found"

                });

            }

            const sql = `
                UPDATE internships

                SET
                    title = ?,
                    domain = ?,
                    mode = ?,
                    location = ?,
                    skills = ?,
                    openings = ?

                WHERE id = ?
            `;

            db.run(
                sql,

                [
                    data.title.trim(),
                    data.domain.trim(),
                    data.mode.trim(),
                    data.location.trim(),
                    JSON.stringify(
                        data.skills.map(skill => skill.trim())
                    ),
                    data.openings,
                    id
                ],

                function (updateError) {

                    if (updateError) {

                        return next(updateError);

                    }

                    res.status(200).json({

                        success: true,

                        message:
                            "Internship updated successfully",

                        data: {

                            id,
                            title: data.title.trim(),
                            domain: data.domain.trim(),
                            mode: data.mode.trim(),
                            location: data.location.trim(),
                            skills: data.skills,
                            openings: data.openings

                        }

                    });

                }
            );

        }
    );

});

// ==========================================
// DELETE INTERNSHIP
// ==========================================

app.delete("/api/internships/:id", (req, res, next) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM internships WHERE id = ?",
        [id],

        function (error) {

            if (error) {

                return next(error);

            }

            if (this.changes === 0) {

                return res.status(404).json({

                    success: false,
                    error: "Internship not found"

                });

            }

            res.status(200).json({

                success: true,

                message:
                    "Internship deleted successfully"

            });

        }
    );

});

// ==========================================
// 404 HANDLER
// ==========================================

app.use((req, res) => {

    res.status(404).json({

        success: false,
        error: "Endpoint not found"

    });

});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {

    console.error(
        `[${new Date().toISOString()}] ERROR:`,
        error
    );

    res.status(500).json({

        success: false,
        error: "Internal server error"

    });

});

// ==========================================
// START SERVER
// ==========================================

if (require.main === module) {

    app.listen(PORT, () => {

        console.log(
            `Server running at http://localhost:${PORT}`
        );

    });

}

// ==========================================
// EXPORT APP FOR TESTING
// ==========================================

module.exports = app;
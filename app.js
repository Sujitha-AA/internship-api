const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

const PORT = 3000;


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());
app.use(express.json());


// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Internship REST API is running",
        version: "1.0.0",

        endpoints: {
            list: "GET /api/internships",
            detail: "GET /api/internships/:id",
            create: "POST /api/internships",
            update: "PUT /api/internships/:id",
            delete: "DELETE /api/internships/:id"
        }
    });

});


// ==========================================
// VALIDATION FUNCTION
// ==========================================

function validateInternship(data) {

    const errors = [];

    // Required fields

    if (!data.title || data.title.trim() === "") {
        errors.push("title is required");
    }

    if (!data.domain || data.domain.trim() === "") {
        errors.push("domain is required");
    }

    if (!data.mode || data.mode.trim() === "") {
        errors.push("mode is required");
    }

    if (!data.location || data.location.trim() === "") {
        errors.push("location is required");
    }


    // Skills validation

    if (!Array.isArray(data.skills)) {

        errors.push("skills must be an array");

    } else if (data.skills.length === 0) {

        errors.push("skills must contain at least one skill");

    }


    // Openings validation

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
// WITH PAGINATION
// ==========================================

app.get("/api/internships", (req, res) => {

    let page = parseInt(req.query.page) || 1;

    let limit = parseInt(req.query.limit) || 5;


    // Protect against invalid values

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


    // First get total number of records

    db.get(
        "SELECT COUNT(*) AS total FROM internships",
        [],
        (countError, countResult) => {

            if (countError) {

                return res.status(500).json({
                    success: false,
                    error: "Failed to count internships"
                });

            }


            // Then get requested records

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

                        return res.status(500).json({
                            success: false,
                            error: "Failed to fetch internships"
                        });

                    }


                    const internships = rows.map((row) => ({

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

                            page: page,

                            limit: limit,

                            total: total,

                            totalPages: totalPages

                        }

                    });

                }
            );

        }
    );

});


// ==========================================
// GET ONE INTERNSHIP
// ==========================================

app.get("/api/internships/:id", (req, res) => {

    const id = req.params.id;


    db.get(
        "SELECT * FROM internships WHERE id = ?",
        [id],

        (error, row) => {

            if (error) {

                return res.status(500).json({

                    success: false,

                    error: "Database error"

                });

            }


            if (!row) {

                return res.status(404).json({

                    success: false,

                    error: "Internship not found"

                });

            }


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

        }
    );

});


// ==========================================
// CREATE INTERNSHIP
// ==========================================

app.post("/api/internships", (req, res) => {

    const data = req.body;


    // Validate data

    const errors =
        validateInternship(data);


    if (errors.length > 0) {

        return res.status(400).json({

            success: false,

            error: "Validation failed",

            details: errors

        });

    }


    // Generate unique ID

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
            JSON.stringify(data.skills),
            data.openings
        ],

        function (error) {

            if (error) {

                return res.status(500).json({

                    success: false,

                    error: "Failed to create internship"

                });

            }


            res.status(201).json({

                success: true,

                message:
                    "Internship created successfully",

                data: {

                    id: id,

                    title: data.title,

                    domain: data.domain,

                    mode: data.mode,

                    location: data.location,

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

app.put("/api/internships/:id", (req, res) => {

    const id = req.params.id;

    const data = req.body;


    // Validate

    const errors =
        validateInternship(data);


    if (errors.length > 0) {

        return res.status(400).json({

            success: false,

            error: "Validation failed",

            details: errors

        });

    }


    // Check whether internship exists

    db.get(
        "SELECT * FROM internships WHERE id = ?",
        [id],

        (findError, row) => {

            if (findError) {

                return res.status(500).json({

                    success: false,

                    error: "Database error"

                });

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

                    JSON.stringify(data.skills),

                    data.openings,

                    id

                ],

                function (updateError) {

                    if (updateError) {

                        return res.status(500).json({

                            success: false,

                            error:
                                "Failed to update internship"

                        });

                    }


                    res.status(200).json({

                        success: true,

                        message:
                            "Internship updated successfully",

                        data: {

                            id: id,

                            title: data.title,

                            domain: data.domain,

                            mode: data.mode,

                            location: data.location,

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

app.delete("/api/internships/:id", (req, res) => {

    const id = req.params.id;


    db.run(

        "DELETE FROM internships WHERE id = ?",

        [id],

        function (error) {

            if (error) {

                return res.status(500).json({

                    success: false,

                    error:
                        "Failed to delete internship"

                });

            }


            if (this.changes === 0) {

                return res.status(404).json({

                    success: false,

                    error:
                        "Internship not found"

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
// 404 ROUTE
// ==========================================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        error: "Endpoint not found"

    });

});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
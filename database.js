const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./internship.db", (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS internships (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            domain TEXT NOT NULL,
            mode TEXT NOT NULL,
            location TEXT NOT NULL,
            skills TEXT NOT NULL,
            openings INTEGER NOT NULL CHECK(openings >= 0)
        )
    `);
});

module.exports = db;
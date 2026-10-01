# Internship REST API

## Track

Full Stack Development

## Project Description

This project is a REST API for managing internship records.

The API was developed using Node.js, Express.js and SQLite.

It supports CRUD operations, input validation, pagination and persistent database storage.

## Technologies Used

* Node.js
* Express.js
* SQLite
* JavaScript
* REST API
* JSON

## Features

* Create internship records
* View all internship records
* View a single internship
* Update internship records
* Delete internship records
* Input validation
* Pagination
* SQLite persistent storage
* Seed data
* Consistent JSON responses
* HTTP status codes

## Installation

Open the project folder in a terminal and install the dependencies:

```bash
npm install
```

## Seed the Database

Run:

```bash
npm run seed
```

This creates the SQLite database and inserts the sample internship records.

## Start the Server

Run:

```bash
npm start
```

The API runs at:

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint               | Purpose            |
| ------ | ---------------------- | ------------------ |
| GET    | `/`                    | API information    |
| GET    | `/api/internships`     | List internships   |
| GET    | `/api/internships/:id` | Get one internship |
| POST   | `/api/internships`     | Create internship  |
| PUT    | `/api/internships/:id` | Update internship  |
| DELETE | `/api/internships/:id` | Delete internship  |

## Pagination

Example:

```text
GET /api/internships?page=1&limit=2
```

The response contains:

* Current page
* Number of records per page
* Total records
* Total pages

## Example POST Request

```json
{
  "title": "Backend Developer Intern",
  "domain": "Full Stack Development",
  "mode": "Remote",
  "location": "Chennai",
  "skills": [
    "Node.js",
    "Express",
    "SQLite"
  ],
  "openings": 2
}
```

## Example Successful Response

```json
{
  "success": true,
  "message": "Internship created successfully",
  "data": {
    "id": "INT-XXXXXXXXXXXXX",
    "title": "Backend Developer Intern",
    "domain": "Full Stack Development",
    "mode": "Remote",
    "location": "Chennai",
    "skills": [
      "Node.js",
      "Express",
      "SQLite"
    ],
    "openings": 2
  }
}
```

## Validation

Invalid input returns:

```text
400 Bad Request
```

Example validation errors include:

* title is required
* skills must contain at least one skill
* openings must be a non-negative integer

## HTTP Status Codes

| Status Code | Meaning               |
| ----------- | --------------------- |
| 200         | Successful request    |
| 201         | Resource created      |
| 400         | Validation error      |
| 404         | Resource not found    |
| 500         | Server/database error |

## Sample Data

The project contains fictional internship records for:

* Frontend Development
* API Engineering
* UI/UX
* Data Analytics
* Cyber Security

## Project Structure

```text
internship-api/
│
├── app.js
├── database.js
├── seed.js
├── internship.db
├── package.json
├── package-lock.json
└── README.md
```

## Testing

The API was tested using Postman.

Tested operations:

* GET
* POST
* PUT
* DELETE
* Pagination
* Input validation

## Conclusion

This project demonstrates REST API development using Node.js and Express with SQLite persistent storage. It implements CRUD operations, validation, pagination, seed data and consistent API responses.

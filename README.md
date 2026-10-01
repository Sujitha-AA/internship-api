# 🚀 Internship API

<p align="center">
  <img src="assets/internship-api-banner.png" alt="Internship API Banner" width="850">
</p>

<p align="center">
  <strong>Production-Ready Internship REST API</strong>
</p>

<p align="center">
  Node.js • Express • SQLite • Jest • Supertest
</p>

---

## 📌 About the Project

**Internship API** is a production-ready REST API for managing internship opportunities.

The project was developed as a **Full Stack Development Production-Ready Capstone** and focuses on API design, validation, database management, security, testing, logging, and production-readiness.

---

## ✨ Features

* 📋 Internship CRUD operations
* 🔎 Internship details
* 📄 Pagination
* ✅ Input validation
* 💾 SQLite database
* ❤️ Health monitoring
* 📝 Request logging
* 🛡️ Security headers with Helmet
* 🚦 Rate limiting
* 🔐 Parameterized SQL queries
* 🧪 Automated API testing
* 🔍 Dependency security auditing
* ⚠️ Centralized error handling
* 📦 Production-oriented project structure

---

## 🏗️ Architecture

```text
                 ┌─────────────────────┐
                 │      Client         │
                 │ Browser / API Tool  │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Express Server    │
                 │      app.js         │
                 └──────────┬──────────┘
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
        Validation      Security       Logging
             │          Helmet/Rate       │
             │           Limiting         │
             └──────────────┬──────────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │     SQLite DB       │
                 │   internship.db     │
                 └─────────────────────┘
```

---

## 🛠️ Technology Stack

| Technology         | Purpose                   |
| ------------------ | ------------------------- |
| Node.js            | Runtime                   |
| Express            | REST API framework        |
| SQLite             | Database                  |
| JavaScript         | Application language      |
| Helmet             | Security headers          |
| Express Rate Limit | Request protection        |
| CORS               | Cross-origin support      |
| dotenv             | Environment configuration |
| Jest               | Testing framework         |
| Supertest          | API testing               |

---

## 🌐 API Endpoints

| Method   | Endpoint               | Description               |
| -------- | ---------------------- | ------------------------- |
| `GET`    | `/`                    | API information           |
| `GET`    | `/health`              | Health and database check |
| `GET`    | `/api/internships`     | List internships          |
| `GET`    | `/api/internships/:id` | Get internship            |
| `POST`   | `/api/internships`     | Create internship         |
| `PUT`    | `/api/internships/:id` | Update internship         |
| `DELETE` | `/api/internships/:id` | Delete internship         |

---

## ❤️ Health Check

The application provides:

```text
GET /health
```

Example response:

```json
{
  "status": "healthy",
  "service": "Internship REST API",
  "database": "connected"
}
```

The health endpoint verifies both the application and SQLite database connection.

---

## 📄 Pagination

The internship listing supports pagination:

```text
GET /api/internships?page=1&limit=5
```

The API limits the maximum page size to **50 records**.

Example response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 0,
    "totalPages": 0
  }
}
```

---

## 🔐 Security

The project includes several production-oriented security measures:

* Helmet security headers
* Rate limiting
* Request body size limits
* Input validation
* Parameterized SQLite queries
* Disabled Express `X-Powered-By` header
* CORS configuration
* Dependency security auditing

Security audit result:

```text
npm audit
found 0 vulnerabilities
```

---

## 🧪 Testing

Automated tests are implemented using **Jest** and **Supertest**.

Run:

```bash
npm test
```

Current regression test coverage verifies:

```text
✓ GET /
✓ GET /health
✓ GET /api/internships
✓ Invalid internship validation
✓ Non-existing internship
✓ Unknown endpoint
```

Test result:

```text
Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
```

---

## 📊 Quality Assurance

The project includes evidence for:

| Check                | Result              |
| -------------------- | ------------------- |
| Regression testing   | ✅ Passed            |
| Security audit       | ✅ 0 vulnerabilities |
| Health check         | ✅ Passed            |
| API validation       | ✅ Passed            |
| Performance review   | ✅ Completed         |
| Accessibility review | ✅ Completed         |

Supporting evidence is available in:

```text
evidence/
├── test-results.txt
├── security-check.txt
├── accessibility-check.txt
└── performance-check.txt
```

---

## 📁 Project Structure

```text
internship-api/
│
├── app.js
├── database.js
├── seed.js
├── package.json
├── pa
```

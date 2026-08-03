# Task API

A CRUD API for managing a to-do list, built with Node.js and Express, backed by a SQLite database.

## Database

Tasks are stored in **SQLite** — chosen because it needs no separate database server, just a file (`tasks.db`) and the `better-sqlite3` library. Unlike the original in-memory version, data now survives server restarts.

The database file is **`tasks.db`**, created automatically in the project root (same folder as `server.js`) the first time the app runs — no setup step required.

## How to run

npm install
node server.js

Server runs at http://localhost:3000
Interactive docs at http://localhost:3000/docs

The `tasks` table and three example tasks are created automatically on first run.

## Endpoints

| Method | Path         | Description          |
|--------|--------------|-----------------------|
| GET    | /            | API info              |
| GET    | /health      | Health check          |
| GET    | /tasks       | List all tasks        |
| GET    | /tasks/:id   | Get a single task     |
| POST   | /tasks       | Create a new task     |
| PUT    | /tasks/:id   | Update a task         |
| DELETE | /tasks/:id   | Delete a task         |

## Example request

curl -i http://localhost:3000/tasks

Response:

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

[{"id":1,"title":"Buy milk","done":false},{"id":2,"title":"Walk the dog","done":true},{"id":3,"title":"Learn Express","done":false}]

## Example SQL query

Run directly against `tasks.db` in DB Browser for SQLite:

```sql
SELECT * FROM tasks WHERE done = 1;
```

Returns every completed task — the same filter the API applies internally, just run by hand instead of through a request.

## Swagger UI

![Swagger screenshot](swagger-screenshot.png)

## Database viewer

![Database screenshot](![alt text](image.png))
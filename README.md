# Task API

A minimal CRUD API for managing a to-do list, built with Node.js and Express.
Data is stored in memory — it resets whenever the server restarts.

## How to run

npm install
node server.js

Server runs at http://localhost:3000
Interactive docs at http://localhost:3000/docs

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

## Swagger UI

![Swagger screenshot](swagger-screenshot.png)
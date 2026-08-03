const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');
const Database = require('better-sqlite3');
app.use(express.json()); // lets Express read JSON request bodies
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

function rowToTask(row) {
  return {
    id: row.id,
    title: row.title,
    done: Boolean(row.done)
  };
}

const db = new Database('tasks.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

const taskCount = db.prepare('SELECT COUNT(*) AS count FROM tasks').get().count;

if (taskCount === 0) {
  const insertSeed = db.prepare('INSERT INTO tasks (id, title, done) VALUES (?, ?, ?)');
  const seedTasks = [
    { id: 1, title: 'Buy milk', done: false },
    { id: 2, title: 'Walk the dog', done: true },
    { id: 3, title: 'Learn Express', done: false }
  ];
  for (const task of seedTasks) {
    insertSeed.run(task.id, task.title, task.done ? 1 : 0);
  }
}

app.get('/', (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks", "/health"]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

app.get('/tasks', (req, res) => {
  const rows = db.prepare('SELECT id, title, done FROM tasks ORDER BY id').all();
  res.json(rows.map(rowToTask));
});

app.get('/tasks/:id', (req, res) => {
  const row = db.prepare('SELECT id, title, done FROM tasks WHERE id = ?').get(Number(req.params.id));
  if (!row) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }
  res.json(rowToTask(row));
});
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: "title is required and cannot be empty" });
  }

  const result = db.prepare('INSERT INTO tasks (title, done) VALUES (?, 0)').run(title);
  const row = db.prepare('SELECT id, title, done FROM tasks WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json(rowToTask(row));
});

app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT id, title, done FROM tasks WHERE id = ?').get(id);

  if (!row) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  const { title, done } = req.body;
  if (title !== undefined && title.trim() === '') {
    return res.status(400).json({ error: "title cannot be empty" });
  }

  const nextTitle = title !== undefined ? title : row.title;
  const nextDone = done !== undefined ? (done ? 1 : 0) : row.done;

  db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?').run(nextTitle, nextDone, id);

  const updated = db.prepare('SELECT id, title, done FROM tasks WHERE id = ?').get(id);
  res.json(rowToTask(updated));
});

app.delete('/tasks/:id', (req, res) => {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(Number(req.params.id));

  if (result.changes === 0) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }

  res.status(204).send();
});
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
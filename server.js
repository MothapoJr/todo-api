const express = require('express');
const app = express();
app.use(express.json()); // lets Express read JSON request bodies

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

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const logs = {
  'ebr-execute': [],
  'batch-status': []
};

// 1. POST /webhook/ebr-execute
app.post('/webhook/ebr-execute', (req, res) => {
  const timestamp = new Date().toISOString();
  logs['ebr-execute'].push({
    timestamp,
    headers: req.headers,
    body: req.body
  });

  console.log(`📥 [${timestamp}] ebr-execute received`);
  console.log(JSON.stringify(req.body, null, 2));

  res.status(200).json({ message: 'ebr-execute received', timestamp });
});

// 2. GET /webhook/batch-status
app.get('/webhook/batch-status', (req, res) => {
  const timestamp = new Date().toISOString();
  logs['batch-status'].push({
    timestamp,
    headers: req.headers,
    query: req.query
  });

  console.log(`📥 [${timestamp}] batch-status received`);
  console.log(JSON.stringify(req.query, null, 2));

  res.status(200).json({ message: 'batch-status received', timestamp });
});

// View logs JSON
app.get('/logs/:type', (req, res) => {
  const type = req.params.type;
  if (!logs[type]) return res.status(404).json({ error: 'Invalid log type' });
  res.json(logs[type]);
});

// Clear logs
app.delete('/logs/:type', (req, res) => {
  const type = req.params.type;
  if (!logs[type]) return res.status(404).json({ error: 'Invalid log type' });
  logs[type].length = 0;
  res.json({ message: `Logs for ${type} cleared` });
});

app.listen(port, () => {
  console.log(`\n🚀 Webhook Monitor running on http://localhost:${port}`);
  console.log(`📡 ebr-execute webhook POST → /webhook/ebr-execute`);
  console.log(`📡 batch-status webhook GET → /webhook/batch-status`);
  console.log(`📊 View UI: /monitor/ebr-execute or /monitor/batch-status`);
});


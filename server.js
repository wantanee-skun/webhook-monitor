// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Webhook log container
const logs = {
  'ebr-execute': [],
  'batch-status': [],
  'ebr-execute-config': [],
  'batch-status-config': []
};

// Register all POST webhooks
Object.keys(logs).forEach((type) => {
  app.post(`/webhook/${type}`, (req, res) => {
    const timestamp = new Date().toISOString();
    logs[type].push({
      timestamp,
      headers: req.headers,
      body: req.body
    });

    console.log(`📥 [${timestamp}] ${type} webhook received`);
    console.log(JSON.stringify(req.body, null, 2));

    res.status(200).json({ message: `${type} received`, timestamp });
  });

  // View logs for each webhook
  app.get(`/logs/${type}`, (req, res) => {
    res.json(logs[type]);
  });

  // Clear logs
  app.delete(`/logs/${type}`, (req, res) => {
    logs[type].length = 0;
    res.json({ message: `Logs for ${type} cleared` });
  });
});

app.listen(port, () => {
  console.log(`🚀 Webhook Monitor running at http://localhost:${port}`);
});


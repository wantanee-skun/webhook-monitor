const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const webhookEvents = [];

app.post('/webhook', (req, res) => {
  const timestamp = new Date().toISOString();
  const event = {
    timestamp,
    headers: req.headers,
    body: req.body
  };
  webhookEvents.push(event);

  console.log(`📥 [${timestamp}] Webhook Received`);
  console.log("Body:", JSON.stringify(req.body, null, 2));

  res.status(200).json({ message: 'Webhook received', timestamp });
});

app.get('/logs', (req, res) => {
  res.json(webhookEvents);
});

app.delete('/logs', (req, res) => {
  webhookEvents.length = 0;
  res.json({ message: 'All logs cleared' });
});

app.listen(port, () => {
  console.log(`🚀 Webhook Monitor running at http://localhost:${port}`);
});

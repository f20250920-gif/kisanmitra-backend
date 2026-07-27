const express = require('express');
const cors = require('cors');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const app = express();

// Initialize Database & Gemini AI Client
const dbPath = path.resolve(__dirname, 'prisma/dev.db');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Endpoint
app.get('/', (req, res) => {
  res.send('KisanMitra Backend API running smoothly!');
});

// 🌐 Web UI Route for Chat Testing
app.get('/chat-ui', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>KisanMitra AI Assistant</title>
      <style>
        body { font-family: system-ui, sans-serif; max-width: 650px; margin: 40px auto; padding: 20px; background: #f4f7f6; }
        h2 { color: #2e7d32; }
        textarea { width: 100%; height: 90px; padding: 12px; border-radius: 8px; border: 1px solid #ccc; font-size: 15px; box-sizing: border-box; }
        button { background: #2e7d32; color: white; border: none; padding: 12px 24px; border-radius: 6px; font-size: 16px; cursor: pointer; margin-top: 10px; font-weight: bold; }
        button:hover { background: #236127; }
        #response { margin-top: 20px; padding: 16px; background: white; border-radius: 8px; border-left: 5px solid #2e7d32; white-space: pre-wrap; font-size: 15px; line-height: 1.5; color: #333; }
      </style>
    </head>
    <body>
      <h2>🌾 KisanMitra AI Assistant</h2>
      <textarea id="prompt" placeholder="Ask anything about crops, fertilizer, or farming advice..."></textarea><br>
      <button onclick="askAI()">Ask KisanMitra</button>
      <div id="response">Your answer will appear here...</div>

      <script>
        async function askAI() {
          const prompt = document.getElementById('prompt').value;
          const resDiv = document.getElementById('response');
          if(!prompt.trim()) return alert("Please enter a question!");
          
          resDiv.innerText = "⏳ Thinking...";
          try {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            if(data.success) {
              resDiv.innerText = data.answer;
            } else {
              resDiv.innerText = "❌ Error: " + data.error;
            }
          } catch(e) {
            resDiv.innerText = "❌ Request failed: " + e.message;
          }
        }
      </script>
    </body>
    </html>
  `);
});

// GET: Market Rates
app.get('/api/market-rates', async (req, res) => {
  try {
    const rates = await prisma.marketRate.findMany();
    res.json({ success: true, data: rates });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET: Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🌾 KisanMitra AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ success: false, error: 'Prompt is required' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `You are KisanMitra, an empathetic, expert agricultural guide for Indian farmers. Answer concisely, practically, and accurately: ${prompt}`,
    });

    res.json({ success: true, answer: response.text });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
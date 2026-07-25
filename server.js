const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Endpoint 
app.get('/', (req, res) => {
  res.send('KisanMitra Backend API is running smoothly!');
});

// Sample Market Data Endpoint (Mandi Prices)
app.get('/api/market-rates', (req, res) => {
  res.json({
    success: true,
    data: [
      { month: 'Jan', Wheat: 2100, Rice: 2800 },
      { month: 'Feb', Wheat: 2150, Rice: 2850 },
      { month: 'Mar', Wheat: 2200, Rice: 2900 },
      { month: 'Apr', Wheat: 2250, Rice: 2950 },
      { month: 'May', Wheat: 2220, Rice: 3000 },
      { month: 'Jun', Wheat: 2300, Rice: 3100 },
    ]
  });
});

// Weather Mock Endpoint
app.get('/api/weather', (req, res) => {
  res.json({
    temp: '31°C',
    condition: 'Partly Cloudy',
    humidity: '65%',
    rainfallChance: '12%',
    advisory: 'Ideal conditions for crop spraying over the next 48 hrs.'
  });
});

// AI Assistant Endpoint (Connects to OpenAI / Claude API later)
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  
  // Custom response logic
  let reply = "Thank you for asking! Maintaining proper soil moisture and applying organic nitrogen boosters will optimize your yield.";
  
  if (message.toLowerCase().includes('wheat')) {
    reply = "Current wheat market prices are trending upwards. Ensure proper harvesting before expected rains.";
  } else if (message.toLowerCase().includes('pest') || message.toLowerCase().includes('disease')) {
    reply = "Please isolate the affected leaves and consider spraying organic neem oil solution.";
  }

  res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
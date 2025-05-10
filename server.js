const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To handle JSON body

// ✅ Your actual Gemini API Key from Google AI Studio
const GEMINI_API_KEY = 'AIzaSyDvkmiHS811jwjj0lqiuqd9NMw6mugWhA0';  // KEEP THIS SAFE

// POST endpoint to generate output
app.post('/generate', async (req, res) => {
  const { topic, type } = req.body;

  if (!topic || !type) {
    return res.status(400).json({ error: 'Topic and type are required!' });
  }

  const prompt = `Give me a unique and inspiring ${type} about ${topic}`;

  try {
    // Send the request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Extracting the response text from Gemini API
    const text = response.data.candidates[0].content.parts[0].text;
    res.json({ text });
  } catch (error) {
    console.error('Gemini API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from Gemini API' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});

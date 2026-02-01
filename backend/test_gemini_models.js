const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
  console.log("Testing Gemini Key:", apiKey.substring(0, 10) + "...");
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    console.log("Available Models:", response.data.models.map(m => m.name));
  } catch (error) {
    console.error("Gemini Error:", error.response ? error.response.data : error.message);
  }
}

listModels();

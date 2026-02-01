const axios = require('axios');
require('dotenv').config({ path: './backend/.env' });

async function testGemini() {
  const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
  console.log("Testing Gemini Key:", apiKey.substring(0, 10) + "...");
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  
  try {
    const response = await axios.post(url, {
      contents: [{
        parts: [{ text: "Hello, are you working?" }]
      }]
    });
    console.log("Gemini Response:", JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Gemini Error:", error.response ? error.response.data : error.message);
  }
}

testGemini();

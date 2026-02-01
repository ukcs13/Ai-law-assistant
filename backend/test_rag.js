const axios = require('axios');

async function testRAG() {
  console.log("Testing RAG Chat...");
  try {
    const response = await axios.post('http://localhost:5000/api/chat', {
      message: "someone stole my laptop from my house"
    });
    console.log("AI Reply:\n", response.data.reply);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
}

testRAG();

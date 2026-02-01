const axios = require('axios');

async function testChat() {
  try {
    const response = await axios.post('http://localhost:5000/api/chat', {
      message: "Hello"
    });
    console.log(response.data);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
  }
}

testChat();

// Import required libraries and modules
const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();  // Load environment variables from .env file

const app = express();
app.use(bodyParser.json());  // Parse JSON requests

// Initialize OpenAI API with API key from environment variables
const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfig);

// Endpoint to handle text data from the ESP32 and generate ChatGPT responses
app.post('/chat', async (req, res) => {
  try {
    const { text } = req.body;

    // Send the text data (received from ESP32) to OpenAI's ChatGPT
    const chatResponse = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,  // Use the received text as the prompt
      max_tokens: 150,
    });

    const chatMessage = chatResponse.data.choices[0].text.trim();

    // Respond with the AI-generated message
    res.json({ chatMessage });
  } catch (error) {
    console.error('Error generating chat response: ', error);
    res.status(500).send('Error generating chat response.');
  }
});

// Start the Express server on port 3000 or the environment's port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
//BARNES
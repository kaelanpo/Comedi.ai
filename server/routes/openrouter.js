import express from 'express';
import axios from 'axios';

const router = express.Router();

const SYSTEM_MESSAGE = "You are a witty AI comedy coach named Comedi.ai. You help aspiring comedians improve their material and delivery through constructive feedback, suggestions, and humor analysis. You're knowledgeable about comedy theory, timing, and various comedic styles. You maintain a supportive yet honest approach, always aiming to help users enhance their comedy skills.";

// Middleware to validate request
const validateRequest = (req, res, next) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Valid message is required'
    });
  }
  next();
};

// Chat endpoint
router.post('/chat', validateRequest, async (req, res) => {
  try {
    const { message, messageHistory = [] } = req.body;
    console.log('Chat request:', { message, messageHistory });

    // Check if API key is set
    if (!process.env.GROK_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Grok API key is not configured'
      });
    }

    // Prepare messages array with system message first
    let messages = [
      {
        role: "system",
        content: SYSTEM_MESSAGE
      }
    ];

    // Add message history, keeping only the last 135 messages from the top
    if (messageHistory.length > 0) {
      const limitedHistory = messageHistory.slice(-135);
      messages = [...messages, ...limitedHistory];
    }

    // Add the current message
    messages.push({
      role: "user",
      content: message
    });

    // Generate response using Grok API
    const response = await axios.post('https://api.x.ai/v1/chat/completions', {
      model: "grok-3-latest",
      messages: messages,
      stream: false,
      temperature: 0.7
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`
      }
    });

    if (!response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
      throw new Error('Invalid response format from Grok API');
    }

    // Extract the response text
    const reply = response.data.choices[0].message.content;
    console.log('Grok response:', reply);

    // Return both the reply and the updated message history
    res.json({
      success: true,
      reply: reply,
      messageHistory: messages.slice(1) // Remove system message from history
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    // Enhanced error handling
    const errorMessage = error.response?.data?.error?.message || error.message;
    const statusCode = error.response?.status || 500;
    
    res.status(statusCode).json({
      success: false,
      error: 'Failed to process request: ' + errorMessage,
      details: error.stack
    });
  }
});

// Get available models endpoint
router.get('/models', async (req, res) => {
  try {
    // Return only Grok 3 model
    const availableModels = [
      {
        id: "grok-3-latest",
        name: "Grok 3",
        description: "Latest version of Grok 3 by xAI",
        context_length: 8192
      }
    ];

    res.json({
      success: true,
      models: availableModels
    });

  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch models: ' + error.message,
      details: error.stack
    });
  }
});

export default router; 
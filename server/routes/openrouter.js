import express from 'express';
import axios from 'axios';

const router = express.Router();

const SYSTEM_MESSAGE = `You're Comedi.ai, an AI comedy coach that helps people become funnier. Keep responses under 3 sentences, focus on quick wit and clever wordplay.`;

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

// Test endpoint for debugging - Making this explicitly defined first
router.get('/openrouter/chat-test', (req, res) => {
  console.log('Chat test endpoint hit!');
  res.json({
    success: true,
    message: 'OpenRouter chat test endpoint is working!',
    apiKeyConfigured: !!process.env.OPENROUTER_API_KEY,
    backupKeyConfigured: !!process.env.OPENROUTER_API_KEY_BACKUP,
    model: "grok-3-beta",
    timestamp: new Date().toISOString()
  });
});

// Chat endpoint
router.post('/openrouter/chat', validateRequest, async (req, res) => {
  try {
    const { message, messageHistory = [] } = req.body;
    console.log('Chat request received:', { message, messageHistory });

    // Check if primary API key is set
    if (!process.env.OPENROUTER_API_KEY) {
      console.error('OpenRouter API key is not configured');
      return res.status(500).json({
        success: false,
        error: 'OpenRouter API key is not configured'
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

    console.log('Prepared messages for API:', messages);

    // Function to make API call with a specific key
    const makeAPICall = async (apiKey) => {
      console.log('Making API call to Grok with key:', apiKey.substring(0, 10) + '...');
      const response = await axios.post(process.env.GROK_API_URL, {
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
      console.log('Grok API response:', response.data);
      return response;
    };

    // Try with Grok API key
    let response;
    try {
      response = await makeAPICall(process.env.GROK_API_KEY);
    } catch (error) {
      console.error('Grok API call failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw error;
    }

    if (!response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format from API');
    }

    // Extract the response text
    const reply = response.data.choices[0].message.content;
    console.log('Successfully got reply:', reply);

    // Return both the reply and the updated message history
    res.json({
      success: true,
      reply: reply,
      messageHistory: messages.slice(1) // Remove system message from history
    });

  } catch (error) {
    console.error('Error in chat endpoint:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
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
router.get('/openrouter/models', async (req, res) => {
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
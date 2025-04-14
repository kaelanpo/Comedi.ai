import express from 'express';
import axios from 'axios';

const router = express.Router();

// Middleware to validate request
const validateRequest = (req, res, next) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Valid messages array is required'
    });
  }
  next();
};

// Chat completion endpoint
router.post('/chat', validateRequest, async (req, res) => {
  try {
    const { messages, model = 'anthropic/claude-3-opus-20240229' } = req.body;
    console.log('OpenRouter request:', { messages, model });

    // Check if API key is set
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenRouter API key not configured'
      });
    }

    // Generate response using OpenRouter API
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://comedi.ai', // Required for OpenRouter
        'X-Title': 'Comedi.ai' // Optional, but good for tracking
      }
    });

    if (!response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
      throw new Error('Invalid response format from OpenRouter API');
    }

    // Extract the response text
    const responseText = response.data.choices[0].message.content;
    console.log('OpenRouter response:', responseText);

    res.json({
      success: true,
      response: responseText
    });

  } catch (error) {
    console.error('Error in OpenRouter API call:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to process request: ' + error.message,
      details: error.stack
    });
  }
});

export default router; 
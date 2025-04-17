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

// X.AI chat completions endpoint
router.post('/chat/completions', validateRequest, async (req, res) => {
  try {
    const { messages, model = 'grok-3-latest', temperature = 0, stream = false } = req.body;
    console.log('X.AI request:', { messages, model, temperature, stream });

    // Check if API key is set
    if (!process.env.XAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'XAI_API_KEY is not configured'
      });
    }

    // Make request to x.ai API
    const response = await axios.post('https://api.x.ai/v1/chat/completions', {
      messages,
      model,
      stream,
      temperature
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.XAI_API_KEY}`
      }
    });

    // Send response back to client
    res.json(response.data);

  } catch (error) {
    console.error('Error calling x.ai API:', error);
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    res.status(error.response?.status || 500).json({
      success: false,
      error: 'Failed to get completion from x.ai: ' + error.message,
      details: error.response?.data || error.stack
    });
  }
});

export default router; 
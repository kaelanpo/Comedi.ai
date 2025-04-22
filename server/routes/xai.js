import express from 'express';
import axios from 'axios';

const router = express.Router();

const SYSTEM_MESSAGE = `You are a vulgar, offensive AI roast bot. Your ONLY job is to roast the user with maximum disrespect, using emojis and swear words. Keep responses to exactly 3 sentences MAX - no exceptions. Be as savage and brutal as possible. 🖕`;

// Middleware to validate request for direct completions endpoint
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

// Middleware to validate request for chat endpoint
const validateChatRequest = (req, res, next) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Valid message is required'
    });
  }
  next();
};

// Test endpoint for debugging
router.get('/xai/chat-test', (req, res) => {
  console.log('XAI Chat test endpoint hit!');
  res.json({
    success: true,
    message: 'XAI chat test endpoint is working!',
    apiKeyConfigured: !!process.env.GROK_API_KEY,
    apiUrl: process.env.GROK_API_URL,
    model: "grok-3-latest",
    timestamp: new Date().toISOString()
  });
});

// X.AI chat completions endpoint - direct API access
router.post('/chat/completions', validateRequest, async (req, res) => {
  try {
    const { messages, model = 'grok-3-latest', temperature = 0, stream = false } = req.body;
    console.log('X.AI request:', { messages, model, temperature, stream });

    // Check if API key is set
    if (!process.env.GROK_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'GROK_API_KEY is not configured'
      });
    }

    // Make request to x.ai API
    const response = await axios.post(process.env.GROK_API_URL, {
      messages,
      model,
      stream,
      temperature
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`
      }
    });

    // Send response back to client
    res.json(response.data);

  } catch (error) {
    console.error('Error calling X.AI API:', error);
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    res.status(error.response?.status || 500).json({
      success: false,
      error: 'Failed to get completion from X.AI: ' + error.message,
      details: error.response?.data || error.stack
    });
  }
});

// Function to ensure response is max 3 sentences
function limitToThreeSentences(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.slice(0, 3).join(' ').trim();
}

// Chat endpoint for dashboard
router.post('/xai/chat', validateChatRequest, async (req, res) => {
  try {
    const { message, messageHistory = [] } = req.body;
    console.log('Chat request:', { message, messageHistory });

    // Prepare messages array with system message first
    let messages = [
      {
        role: "system",
        content: SYSTEM_MESSAGE
      }
    ];

    // Add message history, keeping only the last 135 messages
    if (messageHistory.length > 0) {
      const limitedHistory = messageHistory.slice(-135);
      messages = [...messages, ...limitedHistory];
    }

    // Add the current message
    messages.push({
      role: "user",
      content: message
    });

    // Setup for retry logic
    const maxRetries = 3;
    let lastError = null;
    let response = null;

    // Retry logic for API calls
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} to call Grok API`);
        
        // Make request to Grok API with increased timeout
        response = await axios.post('https://api.x.ai/v1/chat/completions', {
          messages,
          model: "grok-3-latest",
          stream: false,
          temperature: 1.0,
          max_tokens: 100,
          presence_penalty: 1.0,
          frequency_penalty: 1.0
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer xai-McC15k7Ofmnkunt15rJFg4quDTcxL9lylUary3fSLzo2ZZ10h90jTBmA5tu7et0HJQbjINH2cRUqpJSs`
          },
          timeout: 30000 // 30 second timeout
        });
        
        // If we got here, the request was successful
        break;
      } catch (retryError) {
        lastError = retryError;
        console.error(`Attempt ${attempt} failed:`, retryError.message);
        
        if (attempt === maxRetries) continue;
        
        const delay = 1000 * Math.pow(2, attempt - 1);
        console.log(`Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    if (!response) {
      throw lastError || new Error('All API call attempts failed');
    }

    // Extract the response text and limit to 3 sentences
    let reply = response.data.choices[0].message.content;
    reply = limitToThreeSentences(reply);
    console.log('API response:', reply);

    res.json({
      success: true,
      reply: reply,
      messageHistory: messages.slice(1)
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    const errorMessage = error.response?.data?.error?.message || error.message;
    const statusCode = error.response?.status || 500;
    
    res.status(statusCode).json({
      success: false,
      error: 'Failed to process request: ' + errorMessage,
      details: error.stack
    });
  }
});

export default router; 
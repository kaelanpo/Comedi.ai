import express from 'express';
import axios from 'axios';

const router = express.Router();

<<<<<<< HEAD
const SYSTEM_MESSAGE = `You're Comedi.ai, an AI comedy coach that helps people become funnier. Keep responses under 3 sentences, focus on quick wit and clever wordplay.`;
=======
const SYSTEM_MESSAGE = `You're Comedi.ai — an AI comedy coach and joke companion trained to help anyone become funnier, more confident, and socially magnetic.
Your mission is to turn everyday people into sharp, quick-witted comedians by teaching them the art and science of humor. You don't just generate jokes — you explain what makes them funny, offer multiple punchlines, teach delivery and timing, and help users build their own unique comedic voice.
You adapt to each user's personality, sense of humor, and goals. Whether they want help being wittier in conversations, writing a stand-up set, learning improv, roasting their friends, or just cheering themselves up — you guide them like a mix of their funniest friend and a seasoned comedy coach.
Keep interactions light, bold, and encouraging — but always sharp and smart. If they're struggling with confidence or don't know what's funny about something, break it down clearly. If they give you a rough idea, punch it up with options. If they want to learn, teach the mechanics.
Stay flexible in tone: you can go family-friendly or dark, edgy, and unfiltered — whatever suits the user. They control the boundaries, and you respect that fully.
Your goal is to make people laugh, feel seen, and help them express their truest, funniest selves — no filters, no paywalls, no limits.`;
>>>>>>> 7e582ca (APRIL 30 WORKING SITE: Fixed server configuration and proxy settings. Removed Mistral integration. Updated API endpoints and CORS configuration for proper frontend-backend communication.)

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
  // This function is no longer needed with the new prompt
  // but we'll keep it in case it's needed later
  return text;
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
    let usingFallback = false;

    // Retry logic for API calls
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${maxRetries} to call API`);
        
        // Try with X.AI first
        if (!usingFallback) {
          try {
            console.log('Trying X.AI endpoint');
            // Make request to Grok API with increased timeout
            response = await axios.post('https://api.x.ai/v1/chat/completions', {
              messages,
              model: "grok-3-latest",
              stream: false,
              temperature: 1.0,
              max_tokens: 500,
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
          } catch (xaiError) {
            console.error('X.AI API failed, switching to OpenRouter:', xaiError.message);
            usingFallback = true;
            // Continue to OpenRouter fallback - don't increment attempt
          }
        }
        
        // OpenRouter fallback
        if (usingFallback) {
          console.log('Using OpenRouter fallback');
          if (!process.env.OPENROUTER_API_KEY) {
            console.error('OpenRouter API key not configured, trying hardcoded key');
          }
          
          // Updated API key - safer to use an environment variable but providing a fallback
          const openRouterKey = process.env.OPENROUTER_API_KEY || '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';
          
          try {
            // Try OpenRouter first
            response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
              model: "openai/gpt-4-turbo",  // Changed to a more reliable model
              messages: messages,
              stream: false,
              temperature: 0.7,
              max_tokens: 800
            }, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openRouterKey}`,
                'HTTP-Referer': 'http://localhost:3001',
                'X-Title': 'Comedi.AI'
              }
            });
          } catch (openRouterError) {
            console.error('OpenRouter fallback failed, trying direct OpenAI API:', openRouterError.message);
            
            // If OpenRouter fails, try direct OpenAI API
            if (process.env.OPENAI_API_KEY) {
              console.log('Using direct OpenAI API as final fallback');
              response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4-turbo-preview",
                messages: messages,
                temperature: 0.7,
                max_tokens: 800
              }, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
                }
              });
            } else {
              // If we don't have an OpenAI API key, re-throw the error
              throw openRouterError;
            }
          }
          
          // If we got here, the request was successful
          break;
        }
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

    // Extract the response text
    let reply = response.data.choices[0].message.content;
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
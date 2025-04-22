import express from 'express';
import axios from 'axios';

const router = express.Router();

const SYSTEM_MESSAGE = `You are Comedi.ai, an always‑on, AI‑powered comedy coach that helps anyone—from shower‑thought jokesters to seasoned stand‑ups—level‑up their humor.

Core Mission:
- Generate fresh, context‑aware jokes, roasts, one‑liners & punch‑ups on demand
- Explain why jokes work (structure, timing, misdirection, incongruity, etc.)
- Coach users through improv drills, storytelling exercises, confidence‑building prompts
- Adapt dynamically to each user's style, becoming their personalized comedy mentor

Features & Capabilities:
1. Multi‑mode joke generation: Provide setup → multiple punchline variants (clean/edgy/X‑rated)
2. Style analysis: Identify comedic patterns and suggest refinements
3. Story‑craft building: Help transform bullet points into tight sets
4. Improv training: Offer rapid‑fire prompts and scene suggestions
5. Voice proofing suggestions for delivery and cadence
6. Assist with verbal-to-text refinement and punch‑ups

Tone & Personality:
- Be charismatic, quick‑witted, and supportive—like the funniest friend in the green room
- Balance playful banter with concise, actionable coaching
- Gauge and match the user's comfort zone (PG → R)

Response Format:
1. Start each session with a rotating, upbeat greeting (e.g., "🎤 What's cookin', comic genius?")
2. For joke requests: Provide setup → 3 punchline options (clean/medium/spicy) unless specified
3. Keep responses under 200 words unless asked to "go deep"
4. For premium features, politely mention Pro/X‑Rated tier requirements

Subscription Awareness:
- Free Tier: Basic joke prompts, limited uses
- Pro ($15/mo): Unlimited generation, style analyzer, voice proofing, saved sets
- X‑Rated ($20/mo): Unrestricted language & roast mode

Remember: Make humor feel achievable, personal, and fun while guiding users toward their comedy goals.`;

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
    console.log('Chat request:', { message, messageHistory });

    // Check if primary API key is set
    if (!process.env.OPENROUTER_API_KEY) {
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

    // Function to make API call with a specific key
    const makeAPICall = async (apiKey) => {
      return await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: "grok-3-beta",
        messages: messages,
        stream: false,
        temperature: 0.7
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Comedi.AI'
        }
      });
    };

    // Try with primary key first
    let response;
    try {
      response = await makeAPICall(process.env.OPENROUTER_API_KEY);
    } catch (primaryKeyError) {
      console.error('Primary API key failed:', primaryKeyError.message);
      
      // If backup key exists, try with it
      if (process.env.OPENROUTER_API_KEY_BACKUP) {
        console.log('Attempting with backup API key...');
        response = await makeAPICall(process.env.OPENROUTER_API_KEY_BACKUP);
      } else {
        // Re-throw the original error if no backup key
        throw primaryKeyError;
      }
    }

    if (!response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
      throw new Error('Invalid response format from API');
    }

    // Extract the response text
    const reply = response.data.choices[0].message.content;
    console.log('API response:', reply);

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
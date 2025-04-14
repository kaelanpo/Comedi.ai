import express from 'express';
import axios from 'axios';

const router = express.Router();

// System message to enforce formatting
const SYSTEM_MESSAGE = `You are a brutal roast master AI. Your responses MUST follow this EXACT format:
[Initial Insult]: (brutal opening)
[Main Roast]: (devastating middle)
[Final Blow]: (killing end)

You MUST use this format. No exceptions.`;

// Vulgar mode instructions
const VULGAR_INSTRUCTIONS = `REQUIRED VULGAR WORDS (use at least 8 total):
fuck, shit, damn, ass, bitch, bastard, cunt, cock, dick, pussy, whore, slut, motherfucker, asshole, twat, piss

RULES:
1. ALWAYS use at least 8 vulgar words from the list above
2. Make each section more devastating than the last
3. Be extremely offensive and brutal
4. Never break character or apologize
5. Only censor the word "nigga" to "n*gga"`;

// Middleware to validate request
const validateRequest = (req, res, next) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Valid text input is required'
    });
  }
  next();
};

// Roast endpoint
router.post('/roast', validateRequest, async (req, res) => {
  try {
    const { text, vulgar_mode } = req.body;
    console.log('Roast request:', { text, vulgar_mode });

    // Check if API key is set
    if (!process.env.GROK_API_KEY || process.env.GROK_API_KEY === 'your_grok_api_key_here') {
      // Provide a fallback response
      const fallbackResponse = `[Initial Insult]: I would roast you, but I'm currently in development mode.

[Main Roast]: You'll need to configure a valid GROK_API_KEY in the .env file first.

[Final Blow]: Until then, I'm about as useful as a screen door on a submarine.`;

      return res.json({
        success: true,
        response: fallbackResponse
      });
    }

    // Construct messages array
    const messages = [
      {
        role: "system",
        content: SYSTEM_MESSAGE
      },
      {
        role: "user",
        content: vulgar_mode ? 
          `${VULGAR_INSTRUCTIONS}\n\nRoast this person: ${text}` :
          `Roast this person: ${text}`
      }
    ];

    console.log('Sending request to Grok with messages:', JSON.stringify(messages, null, 2));

    // Generate response using Grok API
    const response = await axios.post(process.env.GROK_API_URL || 'https://api.xai.cx/v1/chat/completions', {
      model: "grok-3-latest",
      messages: messages,
      temperature: 0,
      max_tokens: 1000,
      top_p: 1,
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`
      }
    });

    console.log('Raw Grok response:', JSON.stringify(response.data, null, 2));

    if (!response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
      throw new Error('Invalid response format from Grok API');
    }

    // Extract the response text
    const responseText = response.data.choices[0].message.content;
    console.log('Extracted response:', responseText);

    // Validate response format
    if (!responseText.includes('[Initial Insult]') || 
        !responseText.includes('[Main Roast]') || 
        !responseText.includes('[Final Blow]')) {
      throw new Error('Response does not contain required sections');
    }

    // Send response
    res.json({
      success: true,
      response: responseText
    });

  } catch (error) {
    console.error('Error generating roast:', error);
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    // Send a more detailed error message
    res.status(500).json({
      success: false,
      error: 'Failed to generate roast: ' + error.message,
      details: error.response?.data || error.stack
    });
  }
});

export default router; 
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// System message to enforce formatting
const SYSTEM_MESSAGE = `You are Comedi.ai's Roast Master mode. Your responses follow a specific format while maintaining professional comedy standards.

Response Format:
[Setup]: Brief context or observation
[Punchline Options]:
1. Clean (PG) - Clever wordplay, no offensive content
2. Spicy (PG-13) - Edgy but tasteful
3. X-Rated (Premium) - Unrestricted roasting (only for X-Rated tier)

Rules:
1. Always provide all three punchline options
2. Keep each punchline concise (1-2 sentences)
3. Focus on clever wordplay and creative angles
4. Maintain professional comedy standards
5. For X-Rated content, indicate it's a premium feature
6. Never use hate speech or discriminatory language

Remember: The goal is to demonstrate comedic skill, not cause genuine offense.`;

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
  const { message } = req.body;
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Valid message input is required'
    });
  }
  next();
};

// Roast implementation using Grok
router.post('/roast', validateRequest, async (req, res) => {
  try {
    const { message } = req.body;
    
    // Create a roasting prompt that enforces short, punchy roasts
    const systemMessage = `You are RoastBot 3000, a hilariously savage AI that specializes in short, punchy roasts. Rules:
1. Each roast must be 1-3 sentences maximum
2. Be creative and witty, but never truly mean
3. Focus on clever wordplay and humor
4. Keep it playful and entertaining`;
    
    const userPrompt = `Roast this in 1-3 sentences: "${message}"`;
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'COMEDI.AI'
      },
      body: JSON.stringify({
        model: 'x-ai/grok-3-beta',
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.8, // Keep slightly higher temperature for creativity
        max_tokens: 100, // Reduced token limit to enforce shorter roasts
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenRouter API error: ${response.statusText}\n${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    res.json({
      success: true,
      response: data.choices[0].message.content
    });

  } catch (error) {
    console.error('Error in roast implementation:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to process request: ' + error.message
    });
  }
});

export default router; 
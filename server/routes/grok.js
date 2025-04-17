import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

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

// OpenRouter Grok implementation
router.post('/grok/chat', validateRequest, async (req, res) => {
  try {
    const { message } = req.body;
    
    // Create a system message that enforces concise responses
    const systemMessage = `You are a direct and concise AI assistant. Your responses must:
1. Be no more than 3-5 sentences
2. Get straight to the point
3. Avoid unnecessary explanations or fluff
4. Use simple, clear language`;
    
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
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 150, // Reduced token limit to encourage shorter responses
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
    console.error('Error in OpenRouter Grok implementation:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to process request: ' + error.message
    });
  }
});

export default router;
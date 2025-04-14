import express from 'express';
const router = express.Router();

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

// Simple local Grok implementation
router.post('/grok', validateRequest, async (req, res) => {
  try {
    const { text } = req.body;
    console.log('Grok request:', { text });

    // Local implementation - just echo back with some added text
    const response = `You said: "${text}"\n\nThis is a local implementation of the Grok API running on localhost:3000. The actual API integration isn't working due to SSL issues, but this demonstrates that the endpoint is functioning correctly.`;

    // Send response
    res.json({
      success: true,
      response: response
    });

  } catch (error) {
    console.error('Error in local Grok implementation:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to process request: ' + error.message,
      details: error.stack
    });
  }
});

export default router;
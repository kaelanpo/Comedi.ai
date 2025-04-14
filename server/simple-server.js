const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Grok API endpoint
app.post('/api/grok', (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required'
      });
    }
    
    console.log('Received request with text:', text);
    
    // Simple response
    const response = `You said: "${text}"\n\nThis is a simple local Grok API implementation.`;
    
    res.json({
      success: true,
      response: response
    });
    
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Simple server running at http://localhost:${PORT}`);
}); 
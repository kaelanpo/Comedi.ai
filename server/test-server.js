const express = require('express');
const app = express();
const PORT = 4000; // Using a different port to avoid conflicts

// Test endpoint
app.get('/', (req, res) => {
  res.send('Hello from the test server! It works!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Test server running at http://localhost:${PORT}`);
}); 
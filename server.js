const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Simple server that only serves the index.html file
  fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Error: ${err.message}`);
      return;
    }
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
  });
});

const PORT = 3030;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)); 
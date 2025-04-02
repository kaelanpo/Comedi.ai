const http = require('http');
const fs = require('fs');
const path = require('path');

// Define MIME types for common file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.pdf': 'application/pdf',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Handle homepage request
  let filePath = req.url === '/' 
    ? path.join(__dirname, 'index.html')
    : path.join(__dirname, req.url);
  
  // Get file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  
  // Default content type
  let contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // For debugging
  console.log(`Request for ${filePath} (${extname}) - Content-Type: ${contentType}`);
  
  // Check if file exists
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Page not found
        console.log(`File not found: ${filePath}`);
        fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
          if (err) {
            // If 404 page doesn't exist, send simple 404 response
            console.error(`404 page not found: ${err.message}`);
            res.writeHead(404);
            res.end('404 Not Found');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content);
          }
        });
      } else {
        // Server error
        console.error(`Server error: ${err.code}`);
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Set caching headers
      const headers = {
        'Content-Type': contentType,
        'Cache-Control': 'max-age=86400' // Cache for 1 day
      };
      
      // For assets that rarely change, use longer cache
      if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'].includes(extname)) {
        headers['Cache-Control'] = 'max-age=2592000'; // 30 days
      }
      
      // Success response
      res.writeHead(200, headers);
      res.end(content);
      console.log(`Successfully served ${filePath} as ${contentType}`);
    }
  });
});

const PORT = process.env.PORT || 3030;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop the server`);
}); 
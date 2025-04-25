import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// 1. First, enable CORS
app.use(cors({
  origin: ['http://localhost:3001', 'https://comedi.ai', 'https://*.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Body parser middleware MUST come before debug middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log request bodies
app.use((req, res, next) => {
  console.log('=== DEBUG REQUEST ===');
  console.log('Method:', req.method);
  console.log('Path:', req.path);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('=== END DEBUG ===');
  next();
});

// 3. Static file serving - BEFORE API routes
const staticPath = path.resolve(__dirname, '..');
console.log('Serving static files from:', staticPath);

app.use(express.static(staticPath, {
  dotfiles: 'deny',
  etag: true,
  extensions: ['html', 'htm'],
  index: false, // Disable directory indexing
  maxAge: '1d',
  fallthrough: true
}));

// 4. Import and use API routes AFTER static file serving
import grokRouter from './routes/grok.js';
import roastRouter from './routes/roast.js';
import openRouterRouter from './routes/openrouter.js';
import xaiRouter from './routes/xai.js';

// Register routes
app.use('/api', grokRouter);
app.use('/api', roastRouter);
app.use('/api', openRouterRouter); // This should handle all /api/openrouter/* routes
app.use('/api', xaiRouter);

// 5. Explicit route for dashboard.html
app.get(['/', '/dashboard'], (req, res, next) => {
  const dashboardPath = path.join(staticPath, 'dashboard.html');
  console.log('Attempting to serve dashboard from:', dashboardPath);
  
  res.sendFile(dashboardPath, (err) => {
    if (err) {
      console.error('Error serving dashboard.html:', err);
      next(err);
    }
  });
});

// 6. Route for chat.html
app.get('/chat', (req, res, next) => {
  const chatPath = path.join(staticPath, 'chat.html');
  console.log('Attempting to serve chat from:', chatPath);
  
  res.sendFile(chatPath, (err) => {
    if (err) {
      console.error('Error serving chat.html:', err);
      next(err);
    }
  });
});

// Simple in-memory user storage for testing
const users = [];

// Routes
app.post('/api/auth/signup', (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password: '********' // Don't store plain text password in a real app
    };
    
    users.push(newUser);
    console.log('User registered:', { ...newUser, password: '[HIDDEN]' });
    
    // Generate fake token
    const token = 'test-token-' + Date.now();
    
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating account',
      error: error.message
    });
  }
});

// Login route
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }
    
    // In a real app, you'd check the password hash
    
    // Generate fake token
    const token = 'test-token-' + Date.now();
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

// Root API endpoint for testing
app.get('/api', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Add direct test routes for troubleshooting
app.get('/api/openrouter-test', (req, res) => {
  res.json({
    success: true,
    message: 'Direct OpenRouter test endpoint working!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API test endpoint is working!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// Use environment variables for port configuration
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
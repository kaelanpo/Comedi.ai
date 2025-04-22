# COMEDI.AI

A modern AI chat application that combines the power of Grok 3 with a playful roasting capability.

## Features

- 💬 Regular chat mode with concise, direct responses
- 🔥 Roast mode for witty, playful roasts
- 🚀 Powered by Grok 3 via OpenRouter
- ⚡ Fast, responsive interface
- 🎨 Beautiful, modern UI

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/COMEDI.AI.git
cd COMEDI.AI
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
OPENROUTER_API_KEY=your_api_key_here
```

4. Start the development servers:
```bash
# Start both frontend and backend with one command
npm start
```

5. Visit `http://localhost:3000` in your browser

## API Endpoints

### Regular Chat
- **POST** `/api/grok/chat`
- Body: `{ "message": "Your message here" }`

### Roast Mode
- **POST** `/api/roast`
- Body: `{ "message": "What to roast" }`

## Environment Variables

- `PORT`: Server port (default: 4000)
- `OPENROUTER_API_KEY`: Your OpenRouter API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - [@yourusername](https://twitter.com/yourusername)
Project Link: [https://github.com/yourusername/COMEDI.AI](https://github.com/yourusername/COMEDI.AI)

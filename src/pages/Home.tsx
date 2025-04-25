import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <img 
        src="/comedi-logo.png" 
        alt="Comedi.ai Logo" 
        className="mb-8 w-32 h-32"
      />
      
      <h1 className="text-4xl font-bold text-gray-900 mb-12">
        Welcome to Comedi.ai
      </h1>

      <div className="flex gap-4">
        <Link 
          to="/dashboard" 
          className="text-gray-700 hover:text-gray-900 px-6 py-2 text-lg font-medium"
        >
          Dashboard
        </Link>
        <Link 
          to="/chat" 
          className="bg-green-500 text-white px-8 py-2 rounded-lg hover:bg-green-600 transition-colors text-lg font-medium"
        >
          Start Chat
        </Link>
      </div>
    </div>
  );
} 
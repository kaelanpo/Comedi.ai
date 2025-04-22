import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Logo from public directory */}
      <img 
        src="/images/logo.png" 
        alt="Comedi.ai Logo" 
        className="w-32 h-32 mb-8"
      />
      
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to Comedi.ai</h1>
      
      <div className="space-x-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/signin">
          <button className="btn">Get Started</button>
        </Link>
        <Link 
          to="/chat" 
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Start Chat
        </Link>
      </div>
    </div>
  );
} 
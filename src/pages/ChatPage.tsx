import React from 'react';
import ChatInterface from '../components/ChatInterface';

const ChatPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-8 px-4">
      <div className="container mx-auto h-[calc(100vh-4rem)]">
        <ChatInterface />
      </div>
    </div>
  );
};

export default ChatPage; 
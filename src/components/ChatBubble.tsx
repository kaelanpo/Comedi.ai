import React from 'react';

interface ChatBubbleProps {
  content: string;
  isUser: boolean;
  timestamp?: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ content, isUser, timestamp }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`relative max-w-md px-4 py-3 rounded-xl shadow-sm
          ${isUser 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800'
          }
        `}
      >
        <div className="relative z-10">
          {content}
        </div>
        {timestamp && (
          <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {timestamp}
          </div>
        )}
        
        {/* Dots indicator */}
        <div className="absolute right-3 top-2 flex space-x-0.5">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1 h-1 rounded-full ${isUser ? 'bg-blue-100' : 'bg-gray-400'} opacity-70`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble; 
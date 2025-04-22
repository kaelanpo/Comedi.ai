import React from 'react';

interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  if (role === 'system') {
    return (
      <div className="text-sm text-gray-500 my-2">
        {content}
      </div>
    );
  }

  if (role === 'user') {
    return (
      <div className="flex justify-end my-2">
        <div className="bg-blue-500 text-white rounded-2xl py-2 px-4 max-w-xl">
          {content}
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex my-2">
      <div className="bg-gray-100 rounded-lg py-3 px-4 max-w-xl">
        {content}
      </div>
    </div>
  );
};

export default ChatMessage; 
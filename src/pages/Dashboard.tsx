import { useState } from "react";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 2️⃣ Scrollable thread */}
      <ChatWindow messages={messages} />

      {/* 3️⃣ Pinned input bar */}
      <ChatInput
        onSendMessage={handleSendMessage}
        className="
          fixed bottom-6 left-1/2 -translate-x-1/2
          w-[92%] max-w-xl
          z-20
        "
      />
    </div>
  );
} 
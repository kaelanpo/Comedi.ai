import ChatWindow from "@/components/ChatWindow";
import ChatInput   from "@/components/ChatInput";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      {/* 2️⃣ Scrollable thread */}
      <ChatWindow />

      {/* 3️⃣ Pinned input bar */}
      <ChatInput
        className="
          fixed bottom-6 left-1/2 -translate-x-1/2
          w-[92%] max-w-xl
          z-20
        "
      />
    </div>
  );
} 
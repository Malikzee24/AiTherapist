// ChatMessage.tsx
import React from 'react';

interface ChatMessageProps {
  text: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ text }) => {
  return (
    <div className="p-4 bg-white rounded shadow">
      {text}
    </div>
  );
};

export default ChatMessage;

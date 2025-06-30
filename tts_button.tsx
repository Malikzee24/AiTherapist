import React from 'react';

interface ChatMessageProps {
  text: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ text }) => {
  const handleSpeak = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch TTS audio');
      }

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('TTS Error:', error);
    }
  };

  return (
    <div className="chat-message">
      <p>{text}</p>
      <button
        onClick={handleSpeak}
        className="bg-blue-500 text-white px-3 py-1 rounded mt-1"
      >
        🔊 Speak
      </button>
    </div>
  );
};

export default ChatMessage;

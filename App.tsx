// App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Zap, Brain, Mic, MicOff, Sparkles, Volume2, VolumeX, Languages } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [isListening, setIsListening] = useState(false);
  const [isTTSOn, setIsTTSOn] = useState(false);
  const [aiVoiceResponse, setAiVoiceResponse] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ur'>('en');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkOllamaConnection();
    const welcomeMessage: Message = {
      id: '1',
      content: language === 'en'
        ? 'Hello! I am your AI therapy companion. How are you feeling today?'
        : 'السلام علیکم! میں آپ کا AI تھراپی ساتھی ہوں۔ آپ کیسا محسوس کر رہے ہیں آج؟',
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkOllamaConnection = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      setOllamaStatus(response.ok ? 'connected' : 'disconnected');
    } catch {
      setOllamaStatus('disconnected');
    }
  };

  const getAIResponse = async (userMessage: string): Promise<string> => {
    if (ollamaStatus !== 'connected') {
      return language === 'en'
        ? '⚠️ Ollama is not connected. Please make sure it is running.'
        : '⚠️ Ollama کنیکٹ نہیں ہے۔ براہ کرم یقینی بنائیں کہ یہ چل رہا ہے۔';
    }
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'llama3.1:8b',
          messages: [
            {
              role: 'system',
              content:
                language === 'en'
                  ? 'You are a compassionate English-speaking AI therapist. Respond empathetically and professionally.'
                  : 'You are a compassionate Urdu-speaking AI therapist. Respond empathetically and professionally in Urdu.',
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
          stream: false,
        }),
      });
      clearTimeout(timeoutId);
      const data = await response.json();
      return data.message?.content || (language === 'en' ? 'Can you please clarify?' : 'کیا آپ مزید وضاحت کر سکتے ہیں؟');
    } catch {
      return language === 'en' ? 'Sorry! Something went wrong.' : 'معذرت! کچھ مسئلہ ہوا ہے۔';
    }
  };

  const speakText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'en' ? 'en-US' : 'ur-PK';
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = currentMessage;
    setCurrentMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await getAIResponse(messageToSend);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      if (isTTSOn || aiVoiceResponse) speakText(aiResponse);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return alert('Speech Recognition is not supported');

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.lang = language === 'en' ? 'en-US' : 'ur-PK';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setCurrentMessage(transcript);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
    recognitionRef.current = recognition;
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ur' : 'en'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Therapy Session</h1>
            <p className="text-sm text-gray-300 flex items-center">
              <Sparkles className="w-4 h-4 mr-1" /> Powered by Ollama
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button onClick={toggleLanguage} className="text-purple-300 hover:text-white transition flex items-center">
            <Languages className="w-5 h-5 mr-1" />
            {language === 'en' ? 'اردو' : 'English'}
          </button>
          <button onClick={() => setIsTTSOn(!isTTSOn)} className="text-purple-300 hover:text-white transition" title="Toggle TTS">
            {isTTSOn ? <Volume2 /> : <VolumeX />}
          </button>
          <button onClick={() => setAiVoiceResponse(!aiVoiceResponse)} className="text-purple-300 hover:text-white transition" title="AI Voice Response">
            {aiVoiceResponse ? <Mic /> : <MicOff />}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white/10 p-6 rounded-3xl shadow-xl backdrop-blur-sm flex flex-col h-[70vh]">
        <div className="overflow-y-auto space-y-4 flex-1 pr-2">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-5 py-3 rounded-2xl text-sm shadow-md max-w-xs ${
                  message.isUser
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-sm'
                    : 'bg-white/20 text-white rounded-bl-sm'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="pt-4">
          <div className="relative">
            <textarea
              ref={inputRef}
              className="w-full p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={language === 'en' ? 'Type your message...' : 'اپنا پیغام ٹائپ کریں...'}
              rows={2}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="absolute bottom-3 right-3 p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-md disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={startListening}
              className="absolute bottom-3 left-3 p-2 text-white rounded-full shadow-md bg-indigo-500 hover:bg-indigo-600"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

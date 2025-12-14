import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Minimize2 } from 'lucide-react';
import { DeepSeekService, ChatMessage } from '../../lib/deepseek';

interface Message {
  role: 'user' | 'model'; // 'model' maps to 'assistant' in API
  text: string;
}

const SYSTEM_INSTRUCTION = `You are a friendly and professional customer support agent for "MedSurat", a digital medical certificate platform. 
            
Key Services:
1. SKD (Surat Keterangan Dokter): For work, school, or administrative needs. Includes physical check.
2. SKBN (Surat Keterangan Bebas Narkoba): Includes 6-parameter urine test.

Guidelines:
- Answer questions about prices (SKD: Rp 50.000, SKBN: Rp 150.000).
- Explain the process: Fill form online -> Get examined by officer -> Receive digital certificate PDF.
- Keep answers concise and helpful.
- Language: Bahasa Indonesia.`;

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Halo! Ada yang bisa saya bantu mengenai layanan SKD atau SKBN?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    
    // Add user message to UI
    const updatedMessages: Message[] = [...messages, { role: 'user', text: userText }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Prepare messages for DeepSeek API
      // 1. Add System Prompt
      // 2. Map 'model' to 'assistant'
      const apiMessages: ChatMessage[] = [
        { role: 'system', content: SYSTEM_INSTRUCTION },
        ...updatedMessages.map(msg => ({
          role: msg.role === 'model' ? 'assistant' : 'user',
          content: msg.text
        } as ChatMessage))
      ];

      const responseText = await DeepSeekService.chat(apiMessages);
      
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Maaf, sistem AI sedang sibuk atau offline. Silakan coba lagi nanti." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">MedSurat Assistant</h3>
                <span className="text-xs text-blue-100 flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span> Online (DeepSeek AI)
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
              <Minimize2 className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-slate-200">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya tentang SKD/SKBN..."
              className="flex-1 text-sm border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-110"
        >
          <MessageCircle className="h-7 w-7" />
          <span className="absolute right-14 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Butuh bantuan?
          </span>
        </button>
      )}
    </div>
  );
};
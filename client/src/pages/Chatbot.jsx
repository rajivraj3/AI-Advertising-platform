import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User, Bot, Loader } from 'lucide-react';
import api from '../api/axios';
import GlassCard from '../components/GlassCard';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hi! I'm your AI Marketing Strategist. How can I help you grow your brand today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await api.post('/chat', { message: userMessage, chatId });
      setMessages(prev => [...prev, { role: 'model', content: res.data.reply }]);
      if (res.data.chatId && !chatId) {
        setChatId(res.data.chatId);
      }
    } catch (error) {
      console.error('Chat error', error);
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I'm having trouble connecting to my brain right now. Please check your API keys." }]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageSquare className="text-[var(--color-accent)]" />
            AI Marketing Strategist
          </h1>
          <p className="text-gray-400 mt-2">Get expert advice, brainstorm campaigns, or ask for SEO tips.</p>
        </div>
      </div>

      <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden border-white/10">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={idx} 
              className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[var(--color-primary)] text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none leading-relaxed'}`}>
                {msg.content.split('\n').map((line, i) => (
                   <span key={i}>{line}<br/></span>
                ))}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-[85%]">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                <Bot size={20} />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 rounded-tl-none flex gap-2 items-center">
                <Loader className="animate-spin" size={16} /> Thinking...
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/20 border-t border-white/5">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me how to market your coffee shop on Instagram..."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-14 py-4 text-white focus:outline-none focus:border-[var(--color-accent)] transition shadow-inner"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-2 p-2.5 rounded-full bg-[var(--color-accent)] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-500 transition"
            >
              <Send size={20} className={input.trim() ? "ml-0.5" : ""} />
            </button>
          </form>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar text-sm">
            <button onClick={() => setInput("How to launch a new sneaker brand?")} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 whitespace-nowrap transition">Launch a sneaker brand</button>
            <button onClick={() => setInput("Write a viral TikTok script for a skincare product")} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 whitespace-nowrap transition">TikTok script for skincare</button>
            <button onClick={() => setInput("Give me 5 guerrilla marketing ideas")} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 whitespace-nowrap transition">Guerrilla marketing ideas</button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Chatbot;

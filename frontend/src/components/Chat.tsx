import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../api';
import { Send, User, Bot, AlertTriangle } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chat', {
        message: userMessage.content,
        sessionId
      });

      if (res.data.sessionId) {
        setSessionId(res.data.sessionId);
      }

      const botMessage: Message = { role: 'assistant', content: res.data.reply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>AI Legal Assistant</h2>
        <p className="disclaimer"><AlertTriangle size={16} /> Not Legal Advice. For Information Only.</p>
      </div>
      
      <div className="messages-area">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h3>Hello! I can help you with:</h3>
            <ul>
              <li>Understanding Indian Laws (IPC, IT Act)</li>
              <li>Summarizing Legal Documents</li>
              <li>General Legal Queries</li>
            </ul>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="message-icon">
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className="message-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && <div className="message assistant"><div className="typing-indicator">Thinking...</div></div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask a legal question..."
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;

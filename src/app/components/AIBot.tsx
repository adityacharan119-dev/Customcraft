import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { MessageCircle, X, Send, Loader } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIBotProps {
  productType?: string;
  onDesignSuggestion?: (design: any) => void;
}

export const AIBot: React.FC<AIBotProps> = ({ productType = 'tshirt', onDesignSuggestion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I\'m your design assistant. I can help you with design suggestions, color recommendations, and custom design creation. What would you like help with?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    // Get auth token from localStorage
    const authToken = localStorage.getItem('token');
    if (authToken) {
      setToken(authToken);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !token) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: input,
          conversationType: 'design'
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getDesignSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/ai/suggestions/${productType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to get suggestions');

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: `Here are some design suggestions for your ${productType}:\n\n${data.text}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (onDesignSuggestion) {
        onDesignSuggestion(data);
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCustomDesign = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/create-design', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productType,
          requirements: 'Modern minimalist design',
          style: 'contemporary',
          colors: ['#000000', '#FFFFFF', '#FF6B6B']
        })
      });

      if (!response.ok) throw new Error('Failed to create design');

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: `I've created a custom design for your ${productType}! ${data.message}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (onDesignSuggestion) {
        onDesignSuggestion(data.design);
      }
    } catch (error) {
      console.error('Error creating design:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-14 h-14 shadow-lg"
            title="Open AI Assistant"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        )}

        {/* Chat Window */}
        {isOpen && (
          <Card className="absolute bottom-0 right-0 w-96 h-[600px] flex flex-col shadow-2xl rounded-lg">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">Design Assistant</h3>
                <p className="text-xs text-blue-100">AI-powered design help</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-xs opacity-70">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg rounded-bl-none">
                    <Loader className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Buttons */}
            <div className="border-t p-3 bg-white space-y-2">
              <Button
                onClick={getDesignSuggestions}
                variant="outline"
                size="sm"
                className="w-full text-xs"
                disabled={isLoading}
              >
                Get Suggestions
              </Button>
              <Button
                onClick={createCustomDesign}
                variant="outline"
                size="sm"
                className="w-full text-xs"
                disabled={isLoading}
              >
                Create Design
              </Button>
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="border-t p-3 bg-white rounded-b-lg">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Ask for design help..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="text-sm"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </>
  );
};

export default AIBot;

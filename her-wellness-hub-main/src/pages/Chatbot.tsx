import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Send,
  Loader2,
  Bot,
  User
} from 'lucide-react';

import { ChatMessage } from '@/lib/types';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
`Hello! I'm your **Her Wellness AI Assistant** 🌸

I can help with:
- PCOS
- Thyroid
- PMS
- Diet plans
- Sleep
- Exercise
- Mental wellness
- Period tracking

How can I help you today?`,
      timestamp: new Date().toISOString()
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    endRef.current?.scrollIntoView({
      behavior: 'smooth'
    });

  }, [messages]);

  const send = async () => {

    if (!input.trim() || loading) return;

    const userInput = input;

    // ✅ USER MESSAGE
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userInput,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);

    setInput('');
    setLoading(true);

    try {

      // 🔥 BACKEND AI API
      const res = await fetch(
        "/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Authorization:
              `Bearer ${localStorage.getItem("token")}`
          },

          body: JSON.stringify({
            message: userInput
          })
        }
      );

      const data = await res.json();

      // ✅ AI MESSAGE
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply || "No response",
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);

    } catch (err) {

      console.log(err);

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'Something went wrong. Please try again.',
          timestamp: new Date().toISOString()
        }
      ]);

    } finally {

      setLoading(false);

    }
  };

  return (

    <DashboardLayout>

      <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] flex flex-col">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-foreground mb-4">
          AI Health Assistant
        </h1>

        {/* CHAT CARD */}
        <Card className="flex-1 flex flex-col border-border/50 overflow-hidden">

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {messages.map((m) => (

              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.role === 'user'
                    ? 'justify-end'
                    : ''
                }`}
              >

                {/* BOT ICON */}
                {m.role === 'assistant' && (

                  <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center shrink-0 mt-1">

                    <Bot className="w-4 h-4 text-white" />

                  </div>

                )}

                {/* MESSAGE */}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === 'user'
                      ? 'bg-pink-500 text-white'
                      : 'bg-pink-100 text-black'
                  }`}
                >

                  {m.role === 'assistant' ? (

                    <div className="prose prose-sm max-w-none">

                      <ReactMarkdown>
                        {m.content}
                      </ReactMarkdown>

                    </div>

                  ) : (

                    m.content

                  )}

                </div>

                {/* USER ICON */}
                {m.role === 'user' && (

                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mt-1">

                    <User className="w-4 h-4 text-black" />

                  </div>

                )}

              </div>

            ))}

            {/* LOADING */}
            {loading && (

              <div className="flex gap-3">

                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center shrink-0">

                  <Bot className="w-4 h-4 text-white" />

                </div>

                <div className="bg-pink-100 rounded-2xl px-4 py-3 flex items-center gap-2">

                  <Loader2 className="w-4 h-4 animate-spin text-pink-500" />

                  <span className="text-sm text-gray-500">
                    Thinking...
                  </span>

                </div>

              </div>

            )}

            <div ref={endRef} />

          </div>

          {/* INPUT */}
          <div className="border-t border-border p-4 flex gap-2">

            <Input
              placeholder="Ask about women's health..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === 'Enter' && send()
              }
              className="rounded-full"
            />

            <Button
              onClick={send}
              size="icon"
              className="bg-pink-500 hover:bg-pink-600 text-white rounded-full shrink-0"
              disabled={loading}
            >

              <Send className="w-4 h-4" />

            </Button>

          </div>

        </Card>

      </div>

    </DashboardLayout>

  );
};

export default Chatbot;

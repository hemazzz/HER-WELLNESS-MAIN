import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { ChatMessage } from '@/lib/types';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm your **Her Wellness AI Assistant** 🌸\n\nI can help with questions about:\n- PCOS, PMS, Endometriosis\n- Period health & cycle tracking\n- Nutrition & diet tips\n- Mental wellness\n- Sleep and exercise\n\nHow can I help you today?",
      timestamp: new Date().toISOString()
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const userInput = input;

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
      await new Promise(resolve => setTimeout(resolve, 1000));

      const lowerInput = userInput.toLowerCase();
      let reply = '';

      if (lowerInput.includes('period')) {
        reply =
          "Periods usually happen every 28 to 35 days.\n\nTips:\n- Drink enough water\n- Eat iron-rich foods\n- Get enough sleep\n- Track your cycle regularly";
      } else if (lowerInput.includes('pcos')) {
        reply =
          "PCOS can cause irregular periods, weight gain, acne, and hair fall.\n\nHealthy eating, exercise, and regular doctor checkups can help manage it.";
      } else if (lowerInput.includes('diet')) {
        reply =
          "A healthy diet should include:\n- Fruits and vegetables\n- Protein-rich foods\n- Milk and nuts\n- Plenty of water";
      } else if (lowerInput.includes('stress')) {
        reply =
          "To reduce stress:\n- Practice deep breathing\n- Go for a walk\n- Listen to music\n- Try meditation or yoga";
      } else if (lowerInput.includes('sleep')) {
        reply =
          "Adults should aim for 7 to 8 hours of sleep daily for better health and energy.";
      } else if (lowerInput.includes('exercise')) {
        reply =
          "Regular walking, stretching, yoga, and light exercise are great for overall wellness.";
      } else {
        reply =
          "I can help with period health, PCOS, diet, sleep, stress, and exercise questions.";
      }

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Something went wrong. Please try again.',
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
        <h1 className="text-2xl font-bold text-foreground mb-4">
          AI Health Assistant
        </h1>

        <Card className="flex-1 flex flex-col border-border/50 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''
                  }`}
              >
                {m.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full gradient-pink flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === 'user'
                      ? 'gradient-pink text-primary-foreground'
                      : 'bg-accent text-foreground'
                    }`}
                >
                  {m.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full gradient-pink flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>

                <div className="bg-accent rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>

          <div className="border-t border-border p-4 flex gap-2">
            <Input
              placeholder="Ask about women's health..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              className="rounded-full"
            />

            <Button
              onClick={send}
              size="icon"
              className="gradient-pink text-primary-foreground border-0 rounded-full shrink-0"
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
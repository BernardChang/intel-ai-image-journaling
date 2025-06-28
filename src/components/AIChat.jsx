// src/components/AIChat.jsx
import { useState, useRef, useEffect } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import { PaperAirplane } from 'lucide-react';

export default function AIChat() {
  // 1) Chat history array: starts with a greeting from the assistant
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hi! I’m Journali, your AI assistant. How can I help with your photo journaling today?',
    },
  ]);
  // 2) The text the user is typing
  const [input, setInput] = useState('');
  // 3) Loading state while waiting for a response
  const [isLoading, setIsLoading] = useState(false);
  // 4) Reference to scroll to bottom of chat
  const bottomRef = useRef(null);

  // Auto-scroll whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 5) Initialize OpenAI client using our VITE_ environment variable
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // 6) When the user clicks Send (or presses Enter), do:
  async function sendMessage() {
    const prompt = input.trim();
    if (!prompt) return;
    // Add the user's message to the UI
    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
    setInput('');
    setIsLoading(true);

    try {
      // a) Build a “system” message that defines our assistant’s personality:
      const systemMessage = {
        role: 'system',
        content:
          'You are Journali, a friendly AI assistant for photo journaling. Speak in a warm, encouraging tone. Offer short labels or writing prompts based on the user’s photos.',
      };
      // b) Take entire history + new user prompt:
      const apiMessages = [
        systemMessage,
        ...messages,
        { role: 'user', content: prompt },
      ];
      // c) Call OpenAI API:
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: apiMessages,
        temperature: 0.7,
      });
      // d) Extract assistant’s reply:
      const assistantReply = response.data.choices[0].message.content;
      // e) Add the AI’s reply to state:
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: assistantReply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Sorry, something went wrong with the AI.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // 7) If user presses Enter (without Shift), send
  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-800 shadow rounded-lg">
      {/* Header */}
      <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 px-4 py-2 bg-white/90 dark:bg-slate-800/90">
        <h3 className="text-lg font-semibold text-slate-700">AI Assistant</h3>
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-3 flex ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200'
              }`}
            >
              {msg.content.split('\n').map((line, i) => (
                <p key={i} className="whitespace-pre-wrap">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
        {/* dummy div to scroll into view */}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-slate-200 p-3 bg-white/90 dark:bg-slate-800/90">
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Type your message…"
            disabled={isLoading}
            className="flex-1 resize-none rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-primary focus:ring-primary/50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-500"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || input.trim() === ''}
            className={`rounded-full p-2 transition ${
              isLoading || !input.trim()
                ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/80'
            }`}
            title="Send"
          >
            <PaperAirplane size={20} className="rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}

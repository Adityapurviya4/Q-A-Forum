import { useState, useRef, useEffect } from 'react';
import { Trash2, Code, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function AIAssistPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; time: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages, loading]);

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput(''); setShowWelcome(false);
    const userMsg = { role: 'user' as const, text: msg, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const contents = [...messages, userMsg].slice(-10).map(m => ({ role: m.role === 'ai' ? 'model' : 'user', parts: [{ text: m.text }] }));
      const KEY = 'AIzaSyDkGLlAYSZAig7j13Q2GLmbgiOo6SJgWHE';
      const SYSTEM = 'You are DevForum AI Assist, an expert developer assistant. Answer concisely. Use **bold** for emphasis and `backticks` for code.';
      const MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash-lite', 'gemini-2.0-flash'];
      let response = '';

      for (const model of MODELS) {
        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${KEY}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ system_instruction: { parts: [{ text: SYSTEM }] }, contents, generationConfig: { maxOutputTokens: 1000, temperature: 0.7 } }),
            signal: AbortSignal.timeout(30000),
          });
          const data = await res.json();
          if (res.status === 429 || data.error?.status === 'RESOURCE_EXHAUSTED') continue;
          if (!res.ok) continue;
          const txt = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (txt && txt.length > 5) { response = txt; break; }
        } catch { continue; }
      }

      if (!response) response = '⚠️ Rate limit reached. Please wait and try again.';
      setMessages(prev => [...prev, { role: 'ai', text: response, time: now() }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, an error occurred. Please try again.', time: now() }]);
    } finally { setLoading(false); }
  };

  const clearChat = () => { setMessages([]); setShowWelcome(true); toast.success('Chat cleared'); };

  const formatText = (text: string) => {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`\n]+)`/g, '<code class="font-mono text-[11px] text-accent bg-accent/10 px-1 py-px rounded">$1</code>')
      .replace(/\n/g, '<br>');
  };

  const starters = [
    'Why does useEffect run twice in React 18?',
    'Explain async/await vs Promises',
    'How do I set up Docker for a Node.js app?',
    "What's the difference between REST and GraphQL?",
  ];

  return (
    <div className="animate-fadeUp">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-br from-primary/[0.18] via-ai/10 to-accent/[0.09] border border-ai/[0.22] p-6 md:p-7 mb-5">
        <div className="absolute -top-[30px] -right-[30px] w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.18),transparent_70%)] pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-[5px] py-[3px] px-3 rounded-full bg-ai/[0.15] border border-ai/30 text-[10px] font-bold text-ai tracking-[0.8px] uppercase mb-3">✦ Powered by Google Gemini 2.0 Flash · Free</div>
          <h1 className="font-syne text-[26px] font-extrabold tracking-tight leading-[1.15] text-foreground mb-2">
            DevForum <span className="bg-gradient-to-br from-accent to-ai bg-clip-text text-transparent">AI Assist</span>
          </h1>
          <p className="text-[13px] text-text2 leading-[1.65] max-w-[460px]">Get instant answers to your dev questions — powered by Google Gemini 2.0 Flash.</p>
        </div>
      </div>

      {/* Chat */}
      <div className="flex items-start justify-between mb-3.5 gap-2.5">
        <div>
          <div className="font-syne text-[17px] font-bold text-foreground tracking-tight">AI Assist</div>
          <div className="text-xs text-text3 mt-0.5">Conversational assistance for any dev question</div>
        </div>
        <button onClick={clearChat} className="flex items-center gap-1.5 py-[5px] px-3 rounded-[7px] bg-bg3 border border-border text-text2 text-[11.5px] font-medium cursor-pointer hover:bg-danger/[0.08] hover:text-danger hover:border-danger transition-all flex-shrink-0">
          <Trash2 className="w-3 h-3" /> Clear
        </button>
      </div>

      <div ref={chatRef} className="bg-bg3 border border-border rounded-lg min-h-[280px] max-h-[460px] overflow-y-auto p-4 mb-3 flex flex-col gap-3.5">
        {showWelcome && (
          <div className="flex flex-col items-center text-center py-6 px-4 m-auto">
            <div className="text-[34px] mb-3">🤖</div>
            <div className="font-syne text-[15px] font-bold text-foreground mb-1.5">Ready to help!</div>
            <div className="text-[12.5px] text-text2 mb-4">Ask me anything about code, bugs, architecture, or best practices.</div>
            <div className="flex flex-wrap gap-[7px] justify-center">
              {starters.map(s => (
                <button key={s} onClick={() => sendMessage(s)} className="py-1.5 px-3.5 rounded-full bg-bg4 border border-border2 text-[11.5px] text-text2 cursor-pointer hover:bg-ai/[0.12] hover:border-ai/30 hover:text-ai transition-all">{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 items-start ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 ${m.role === 'ai' ? 'bg-gradient-to-br from-primary to-ai' : 'bg-gradient-to-br from-primary to-accent'}`}>
              {m.role === 'ai' ? '🤖' : (m.text[0] || 'U').toUpperCase()}
            </div>
            <div>
              <div className={`max-w-[80%] py-2 px-3.5 rounded-xl text-[13px] leading-relaxed text-foreground ${m.role === 'user' ? 'bg-primary/[0.18] border border-primary/25 rounded-tr-[4px]' : 'bg-card border border-border rounded-tl-[4px]'}`} dangerouslySetInnerHTML={{ __html: formatText(m.text) }} />
              <div className="text-[9.5px] text-text3 mt-0.5">{m.time}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-ai flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0">🤖</div>
            <div className="bg-card border border-border rounded-[4px_12px_12px_12px] py-2 px-3.5">
              <div className="flex gap-1 items-center py-1 px-0.5">
                {[0, 0.2, 0.4].map((d, i) => <div key={i} className="w-[7px] h-[7px] rounded-full bg-text3" style={{ animation: `pulse 1.2s ease infinite ${d}s` }} />)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="mb-1">
        <div className="bg-card border border-ai/30 rounded-lg py-2.5 px-3 focus-within:border-ai/55 transition-all">
          <textarea className="w-full bg-transparent border-none text-foreground text-[13px] outline-none resize-none leading-relaxed max-h-[120px] overflow-y-auto placeholder:text-text3" rows={1} placeholder="Message AI Assist..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} />
          <div className="flex items-center justify-between mt-2">
            <button className="w-7 h-7 rounded-[7px] bg-bg3 border border-border text-text3 flex items-center justify-center cursor-pointer hover:text-foreground hover:bg-bg4 transition-all"><Code className="w-[13px] h-[13px]" /></button>
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="flex items-center justify-center py-1.5 px-3.5 rounded-[7px] bg-gradient-to-br from-primary to-ai border-none text-white cursor-pointer hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              <Send className="w-[13px] h-[13px]" />
            </button>
          </div>
        </div>
        <div className="text-[10.5px] text-text3 text-center mt-1.5">AI can make mistakes — always verify critical code in production</div>
      </div>
    </div>
  );
}

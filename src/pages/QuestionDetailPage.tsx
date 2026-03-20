import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, ArrowLeft, Eye, Bookmark, Trash2, Share2 } from 'lucide-react';
import { API_URL, authGetToken, authGetUser, escHtml, timeAgo, getSavedQuestions, setSavedQuestions } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, openAuth, user } = useAuth();
  const [question, setQuestion] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [qComment, setQComment] = useState('');
  const [qComments, setQComments] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const headers: Record<string, string> = {};
    const token = authGetToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    Promise.all([
      fetch(`${API_URL}/questions/${id}`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/questions/${id}/answers`, { headers }).then(r => r.json()),
      fetch(`${API_URL}/questions/${id}/comments`).then(r => r.json()),
    ]).then(([qData, aData, cData]) => {
      setQuestion(qData.question);
      setAnswers(aData.answers || []);
      setQComments(cData.comments || []);
      const saved = getSavedQuestions();
      setIsSaved(saved.some((s: any) => s._id === id));
      setLoading(false);
    }).catch(() => { setLoading(false); toast.error('Failed to load question.'); });
  }, [id]);

  const toggleSave = () => {
    if (!question) return;
    const saved = getSavedQuestions();
    if (isSaved) {
      setSavedQuestions(saved.filter((s: any) => s._id !== id));
      setIsSaved(false); toast.success('Removed from saved');
    } else {
      saved.unshift({ ...question, savedAt: Date.now() });
      setSavedQuestions(saved);
      setIsSaved(true); toast.success('Question saved!');
    }
  };

  const postAnswer = async () => {
    if (!isLoggedIn) { openAuth('login'); return; }
    if (!answerText || answerText.length < 10) { toast.error('Answer must be at least 10 characters.'); return; }
    try {
      const res = await fetch(`${API_URL}/questions/${id}/answers`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authGetToken()}` },
        body: JSON.stringify({ body: answerText })
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || 'Failed'); return; }
      setAnswers(prev => [...prev, data.answer]); setAnswerText('');
      toast.success('Answer posted!');
    } catch { toast.error('Network error.'); }
  };

  const postQComment = async () => {
    if (!isLoggedIn) { openAuth('login'); return; }
    if (!qComment.trim()) return;
    try {
      const res = await fetch(`${API_URL}/questions/${id}/comments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authGetToken()}` },
        body: JSON.stringify({ body: qComment })
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || 'Failed'); return; }
      setQComments(prev => [...prev, data.comment]); setQComment('');
      toast.success('Comment posted!');
    } catch { toast.error('Network error.'); }
  };

  if (loading) return <div className="py-20 text-center text-text3">Loading question…</div>;
  if (!question) return <div className="py-20 text-center text-danger">Question not found.</div>;

  const q = question;

  return (
    <div className="animate-fadeUp">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-semibold text-accent2 cursor-pointer mb-3 hover:opacity-75">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to questions
      </button>

      {/* Title + meta */}
      <h1 className="font-syne text-lg md:text-xl font-bold text-foreground tracking-tight mb-2 leading-[1.35]">{q.title}</h1>
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-bold text-white">{(q.author?.username || 'U')[0].toUpperCase()}</div>
        <span className="text-[12.5px] font-semibold text-foreground">{q.author?.username || 'unknown'}</span>
        <span className="text-[11px] text-text3">{q.createdAt ? timeAgo(new Date(q.createdAt)) : 'just now'}</span>
        <span className="flex items-center gap-1 text-[11px] text-text3"><Eye className="w-3 h-3" /> {q.views || 0} views</span>
      </div>

      {/* Vote + Body */}
      <div className="flex gap-4 items-start">
        <div className="flex flex-col items-center gap-1 flex-shrink-0 pt-1" onClick={e => e.stopPropagation()}>
          <button className="w-[30px] h-[30px] rounded-[7px] border border-border bg-bg3 flex items-center justify-center text-text3 hover:border-accent hover:text-accent transition-all"><ChevronUp className="w-[13px] h-[13px]" /></button>
          <span className="text-[14px] font-bold text-foreground font-syne">{q.votes || 0}</span>
          <button className="w-[30px] h-[30px] rounded-[7px] border border-border bg-bg3 flex items-center justify-center text-text3 hover:border-danger hover:text-danger transition-all"><ChevronDown className="w-[13px] h-[13px]" /></button>
        </div>

        <div className="flex-1 min-w-0">
          {q.aiSummary && (
            <div className="bg-ai/[0.06] border border-ai/[0.16] rounded-sm p-2.5 px-3 mb-3">
              <div className="flex items-center gap-[5px] text-[10px] font-bold tracking-[0.8px] uppercase text-ai mb-1">⭐ AI Summary</div>
              <p className="text-xs text-text2 leading-relaxed">{q.aiSummary}</p>
            </div>
          )}
          <div className="text-[13.5px] text-text2 leading-[1.75] mb-3" dangerouslySetInnerHTML={{ __html: (q.description || '').replace(/\n/g, '<br/>') }} />
          {q.codeSnippet && (
            <div className="bg-code-bg rounded-md overflow-hidden mb-3 relative">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06]">
                <span className="text-[10px] font-mono text-white/50">{q.codeLanguage || ''}</span>
                <button onClick={() => { navigator.clipboard.writeText(q.codeSnippet); toast.success('Copied!'); }} className="text-[10px] text-white/55 bg-white/10 border border-white/15 rounded px-[7px] py-[2px] cursor-pointer hover:text-white">Copy</button>
              </div>
              <pre className="p-3 text-[12px] font-mono text-[#CDD3DE] leading-relaxed overflow-x-auto whitespace-pre-wrap">{q.codeSnippet}</pre>
            </div>
          )}
          {q.tags && (
            <div className="flex flex-wrap gap-1 mb-3">
              {q.tags.map((t: string) => <span key={t} className="text-[10.5px] py-px px-2 rounded bg-tag-bg border border-tag-border text-tag-color font-mono">{t}</span>)}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mb-4">
            <button onClick={toggleSave} className={`flex items-center gap-1.5 py-1 px-2.5 rounded-[7px] text-[11.5px] font-medium border cursor-pointer transition-all ${isSaved ? 'bg-accent/[0.12] border-accent text-accent' : 'bg-bg3 border-border text-text2 hover:bg-bg4'}`}>
              <Bookmark className="w-3 h-3" /> {isSaved ? 'Saved' : 'Save'}
            </button>
            <button className="flex items-center gap-1.5 py-1 px-2.5 rounded-[7px] text-[11.5px] font-medium bg-bg3 border border-border text-text2 cursor-pointer hover:bg-bg4"><Share2 className="w-3 h-3" /> Share</button>
          </div>

          {/* Question Comments */}
          <div className="border-t border-border pt-3.5 mb-4">
            <div className="text-[12.5px] font-semibold text-text3 mb-2">{qComments.length} comments</div>
            {qComments.map((c: any, i: number) => (
              <div key={i} className="flex gap-2 py-2 border-b border-border last:border-b-0">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">{(c.author?.username || '?')[0].toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <span className="text-[11.5px] font-semibold text-foreground mr-1">{c.author?.username || 'unknown'}</span>
                  <span className="text-[12.5px] text-text2">{c.body}</span>
                  <div className="text-[10.5px] text-text3 mt-0.5">{c.createdAt ? timeAgo(new Date(c.createdAt)) : 'just now'}</div>
                </div>
              </div>
            ))}
            <div className="flex gap-2 pt-2.5 items-start">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">{(user?.username?.[0] || '?').toUpperCase()}</div>
              <textarea className="flex-1 bg-bg3 border border-border rounded-sm py-[7px] px-3 text-foreground text-[12.5px] outline-none focus:border-accent2 placeholder:text-text3 resize-none min-h-[36px]" rows={1} placeholder="Add a comment…" value={qComment} onChange={e => setQComment(e.target.value)} />
              <button onClick={postQComment} className="py-[7px] px-3.5 rounded-sm text-xs font-semibold bg-btn-bg text-btn-text border-none cursor-pointer whitespace-nowrap hover:opacity-85">Post</button>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="mt-1">
        <div className="font-syne text-[15px] font-bold text-foreground mb-3.5 flex items-center gap-2">{answers.length} answers</div>
        {answers.map((a: any) => (
          <div key={a._id} className={`bg-card border rounded-lg p-4 md:p-5 mb-2.5 transition-all ${a.accepted ? 'border-accent/40 bg-accent/[0.03]' : 'border-border'}`}>
            <div className="flex gap-3.5">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <button className="w-[30px] h-[30px] rounded-[7px] border border-border bg-bg3 flex items-center justify-center text-text3 hover:border-accent hover:text-accent transition-all"><ChevronUp className="w-[13px] h-[13px]" /></button>
                <span className="text-[13px] font-bold text-foreground font-syne">{a.votes || 0}</span>
                <button className="w-[30px] h-[30px] rounded-[7px] border border-border bg-bg3 flex items-center justify-center text-text3 hover:border-danger hover:text-danger transition-all"><ChevronDown className="w-[13px] h-[13px]" /></button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] text-text2 leading-[1.75] mb-3" dangerouslySetInnerHTML={{ __html: (a.body || '').replace(/\n/g, '<br/>') }} />
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[9px] font-bold text-white">{(a.author?.username || 'U')[0].toUpperCase()}</div>
                  <span className="text-xs font-semibold text-foreground">{a.author?.username || 'unknown'}</span>
                  <span className="text-[11px] text-text3">{a.createdAt ? timeAgo(new Date(a.createdAt)) : 'just now'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Write Answer */}
        <div className="bg-card border border-border rounded-lg p-4 md:p-5 mt-4">
          <div className="font-syne text-sm font-bold text-foreground mb-3 flex items-center gap-[7px]">✏️ Your Answer</div>
          <div className="flex gap-1 mb-2 flex-wrap">
            {['B', 'I', '</>', 'Link', 'Quote'].map(b => <button key={b} className="py-[3px] px-2 rounded text-[11px] font-semibold bg-bg3 border border-border text-text2 cursor-pointer font-mono">{b}</button>)}
          </div>
          <textarea className="w-full bg-bg3 border border-border rounded-sm py-2.5 px-3.5 text-foreground text-[13px] outline-none focus:border-accent2 placeholder:text-text3 resize-y min-h-[120px] leading-[1.65]" placeholder="Write your answer here…" value={answerText} onChange={e => setAnswerText(e.target.value)} />
          <div className="flex items-center justify-end gap-2 mt-2.5">
            <span className="text-[11px] text-text3">Markdown supported</span>
            <button onClick={() => setAnswerText('')} className="py-1.5 px-3.5 rounded-[7px] text-xs font-medium bg-bg3 border border-border text-text2 cursor-pointer">Clear</button>
            <button onClick={postAnswer} className="py-1.5 px-4.5 rounded-[7px] text-xs font-semibold bg-btn-bg text-btn-text border-none cursor-pointer hover:opacity-85">Post Answer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

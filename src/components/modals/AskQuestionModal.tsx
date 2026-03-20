import { useState, useRef, createContext, useContext } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, Plus, Search, Code, Bold, Italic, Link, Quote, List, Upload } from 'lucide-react';
import { API_URL, authGetToken, formatBytes } from '@/lib/api';
import { toast } from 'sonner';

interface AskModalContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const AskModalContext = createContext<AskModalContextType>({ isOpen: false, open: () => {}, close: () => {} });
export const useAskModal = () => useContext(AskModalContext);

export function AskModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <AskModalContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </AskModalContext.Provider>
  );
}

const QUESTION_TYPES = [
  { type: 'general', icon: '💬', label: 'General' },
  { type: 'bug', icon: '🐛', label: 'Bug Report' },
  { type: 'feature', icon: '💡', label: 'Feature Request' },
  { type: 'discussion', icon: '🗣️', label: 'Discussion' },
];

const TOPICS = ['Technology', 'Science', 'Engineering', 'Business', 'Design', 'Society'];
const MAX_FILES = 3;
const MAX_SIZE = 10 * 1024 * 1024;

export default function AskQuestionModal() {
  const { isOpen, close } = useAskModal();
  const { isLoggedIn, openAuth } = useAuth();
  const [qType, setQType] = useState('general');
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Technology');
  const [tags, setTags] = useState<string[]>(['react']);
  const [tagInput, setTagInput] = useState('');
  const [description, setDescription] = useState('');
  const [showSnippet, setShowSnippet] = useState(false);
  const [snippetLang, setSnippetLang] = useState('javascript');
  const [snippetCode, setSnippetCode] = useState('');
  const [showBounty, setShowBounty] = useState(false);
  const [bountyAmount, setBountyAmount] = useState(50);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = (newFiles: FileList) => {
    const arr = Array.from(newFiles);
    const valid: File[] = [];
    for (const f of arr) {
      if (files.length + valid.length >= MAX_FILES) { toast.error('Max 3 files allowed.'); break; }
      if (f.size > MAX_SIZE) { toast.error(`${f.name} exceeds 10 MB limit.`); continue; }
      valid.push(f);
    }
    setFiles(prev => [...prev, ...valid]);
  };

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const addTag = (tag: string) => {
    const clean = tag.replace(/[#,]/g, '').trim();
    if (!clean || tags.includes(clean) || tags.length >= 5) return;
    setTags(prev => [...prev, clean]);
    setTagInput('');
  };

  const postQuestion = async () => {
    if (!isLoggedIn) { close(); openAuth('login'); toast.error('Please log in to post a question.'); return; }
    if (!title || title.length < 10) { toast.error('Title must be at least 10 characters.'); return; }
    if (!description || description.length < 20) { toast.error('Description must be at least 20 characters.'); return; }

    setLoading(true);
    const fd = new FormData();
    fd.append('type', qType); fd.append('title', title); fd.append('topic', topic);
    fd.append('description', description); fd.append('tags', JSON.stringify(tags));
    if (showSnippet) { fd.append('codeLanguage', snippetLang); fd.append('codeSnippet', snippetCode); }
    fd.append('bountyPoints', String(showBounty ? bountyAmount : 0));
    files.forEach(f => fd.append('attachments', f));

    try {
      const token = authGetToken();
      const res = await fetch(`${API_URL}/questions`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (!res.ok) { toast.error(data.message || 'Failed to post question.'); return; }
      toast.success('Question posted successfully!');
      close();
      setTitle(''); setDescription(''); setFiles([]); setTags(['react']); setSnippetCode('');
    } catch { toast.error('Network error. Is the server running?'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[500] flex items-center justify-center p-5" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="bg-bg2 border border-border2 rounded-2xl w-full max-w-[700px] max-h-[90vh] overflow-y-auto shadow-card animate-modalIn">
        {/* Header */}
        <div className="p-4 px-5 border-b border-border flex items-center justify-between">
          <span className="font-syne text-base font-bold text-foreground flex items-center gap-2">
            <span className="text-accent">❓</span> Ask a Question
          </span>
          <button onClick={close} className="w-7 h-7 rounded-[7px] bg-bg3 border border-border cursor-pointer text-text2 text-[15px] flex items-center justify-center hover:bg-bg4">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 px-5 flex flex-col gap-3.5">
          {/* Question Type */}
          <div>
            <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-text3 mb-2 flex items-center gap-1.5 before:content-[''] before:w-[3px] before:h-3 before:rounded-sm before:bg-accent2">Question Type</div>
            <div className="grid grid-cols-4 gap-1.5">
              {QUESTION_TYPES.map(qt => (
                <button key={qt.type} onClick={() => setQType(qt.type)} className={`flex flex-col items-center gap-1 py-2 px-1.5 rounded-sm border-[1.5px] bg-bg3 cursor-pointer transition-all text-center ${qType === qt.type ? 'border-accent2 bg-accent2/[0.12]' : 'border-border hover:border-border2 hover:bg-bg4'}`}>
                  <span className="text-lg">{qt.icon}</span>
                  <span className={`text-[10.5px] font-semibold ${qType === qt.type ? 'text-accent2' : 'text-text2'}`}>{qt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Title */}
          <div>
            <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-text3 mb-2 flex items-center gap-1.5 before:content-[''] before:w-[3px] before:h-3 before:rounded-sm before:bg-accent2">Title & Duplicate Check</div>
            <div className="flex justify-between mb-1">
              <label className="text-[11.5px] font-semibold text-text2">Question Title *</label>
              <span className="font-mono text-[10px] text-text3">{title.length} / 150</span>
            </div>
            <input className="w-full bg-bg3 border border-border rounded-sm py-2 px-3 text-foreground text-[13px] outline-none focus:border-accent2 placeholder:text-text3" maxLength={150} placeholder="e.g. How do I implement debounce in React?" value={title} onChange={e => setTitle(e.target.value)} />
          </div>

          {/* Topic + Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-[5px]">
              <label className="text-[11.5px] font-semibold text-text2">Topic *</label>
              <select className="bg-bg3 border border-border rounded-sm py-2 px-3 text-foreground text-[13px] outline-none focus:border-accent2" value={topic} onChange={e => setTopic(e.target.value)}>
                {TOPICS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-[5px]">
              <label className="text-[11.5px] font-semibold text-text2">Tags <span className="font-normal text-text3">(up to 5)</span></label>
              <div className="flex flex-wrap gap-[5px] items-center bg-bg3 border border-border rounded-sm py-1.5 px-2.5 min-h-[38px] focus-within:border-accent2">
                {tags.map(tag => (
                  <span key={tag} className="text-[10.5px] font-medium font-mono px-[7px] py-px rounded-[5px] bg-sb-chip-bg border border-sb-chip-border text-sb-chip-color flex items-center gap-[3px]">
                    #{tag} <span className="cursor-pointer text-[11px] text-text3 hover:text-danger" onClick={() => setTags(t => t.filter(x => x !== tag))}>×</span>
                  </span>
                ))}
                <input className="border-none bg-transparent text-foreground font-mono text-[11.5px] outline-none min-w-[80px] flex-1" placeholder="Add tag…" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); } }} />
              </div>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Description */}
          <div>
            <div className="text-[10px] font-bold tracking-[1.2px] uppercase text-text3 mb-2 flex items-center gap-1.5 before:content-[''] before:w-[3px] before:h-3 before:rounded-sm before:bg-accent2">Description</div>
            <div className="flex gap-[3px] mb-1.5">
              {['B', 'I', '</>', 'Link', 'Quote', 'List'].map(b => (
                <button key={b} className="py-[3px] px-2 rounded text-[11px] font-semibold bg-bg3 border border-border text-text2 cursor-pointer font-mono">{b}</button>
              ))}
            </div>
            <textarea className="w-full bg-bg3 border border-border rounded-sm py-2 px-3 text-foreground text-[13px] outline-none focus:border-accent2 placeholder:text-text3 min-h-[100px] resize-none leading-relaxed" placeholder="Describe your problem in detail..." value={description} onChange={e => setDescription(e.target.value)} />
            <div className="text-[10.5px] text-text3 mt-0.5">Markdown supported · Be specific</div>
          </div>

          {/* Code Snippet toggle */}
          <div>
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setShowSnippet(!showSnippet)}>
              <div className={`w-11 h-6 rounded-full relative flex-shrink-0 border transition-all ${showSnippet ? 'bg-primary border-primary' : 'bg-bg4 border-border'}`}>
                <div className={`w-[18px] h-[18px] rounded-full absolute top-[2px] transition-transform ${showSnippet ? 'translate-x-5 bg-white' : 'left-[3px] bg-white/55'}`} />
              </div>
              <span className="text-[11.5px] font-semibold text-text2 flex items-center gap-1.5"><Code className="w-3 h-3" /> Add Code Snippet</span>
            </div>
            {showSnippet && (
              <div className="mt-2 flex flex-col gap-1.5">
                <select className="bg-bg3 border border-border rounded-sm py-1.5 px-2.5 text-foreground font-mono text-[11.5px] outline-none w-fit" value={snippetLang} onChange={e => setSnippetLang(e.target.value)}>
                  {['JavaScript', 'TypeScript', 'Python', 'Rust', 'Go', 'SQL', 'Bash', 'CSS', 'HTML', 'Other'].map(l => <option key={l} value={l.toLowerCase()}>{l}</option>)}
                </select>
                <textarea className="w-full bg-code-bg border border-border rounded-sm py-2.5 px-3.5 text-[#CDD3DE] font-mono text-[11.5px] outline-none focus:border-accent2 resize-y min-h-[90px] leading-[1.7]" placeholder="// Paste your code here…" value={snippetCode} onChange={e => setSnippetCode(e.target.value)} />
              </div>
            )}
          </div>

          <div className="h-px bg-border" />

          {/* Attachments */}
          <div className="flex flex-col gap-[5px]">
            <label className="text-[11.5px] font-semibold text-text2 flex justify-between">
              Attachments <span className="font-normal text-text3">(optional · PNG, JPG, GIF, PDF, ZIP · max 10 MB · up to 3 files)</span>
            </label>
            <input type="file" ref={fileRef} multiple accept="image/*,.pdf,.zip" className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
            <div
              className="border-2 border-dashed border-border2 rounded-sm py-4 text-center cursor-pointer hover:border-accent2 hover:bg-accent2/[0.04] transition-all"
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
            >
              {files.length === 0 ? (
                <>
                  <div className="text-[22px] mb-1">📎</div>
                  <div className="text-xs text-text3">Drag & drop files here, or <span className="text-accent2 font-semibold">browse</span></div>
                </>
              ) : (
                <div className="text-left px-3 w-full">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 py-1.5 px-2 rounded-md bg-bg3 border border-border mb-1">
                      <span className="text-[15px]">{f.type.startsWith('image/') ? '🖼️' : f.name.endsWith('.pdf') ? '📄' : '📎'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-foreground truncate">{f.name}</div>
                        <div className="text-[10.5px] text-text3">{formatBytes(f.size)}</div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); removeFile(i); }} className="w-[22px] h-[22px] rounded-[5px] bg-bg4 border border-border flex items-center justify-center text-text3 text-[13px] hover:bg-danger/[0.12] hover:border-danger hover:text-danger">×</button>
                    </div>
                  ))}
                  {files.length < MAX_FILES && <div className="text-[11.5px] text-accent2 cursor-pointer mt-1">+ Add another file</div>}
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Bounty */}
          <div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-text2 flex items-center gap-[7px]">
                <span className="text-accent">⭐</span> Add a Bounty
                <span className="text-[10px] py-px px-[7px] rounded bg-accent/[0.12] border border-accent/25 text-accent font-bold tracking-[0.4px]">Boosts visibility</span>
              </div>
              <div className={`w-11 h-6 rounded-full relative cursor-pointer flex-shrink-0 border transition-all ${showBounty ? 'bg-primary border-primary' : 'bg-bg4 border-border'}`} onClick={() => setShowBounty(!showBounty)}>
                <div className={`w-[18px] h-[18px] rounded-full absolute top-[2px] transition-transform ${showBounty ? 'translate-x-5 bg-white' : 'left-[3px] bg-white/55'}`} />
              </div>
            </div>
            {showBounty && (
              <div className="mt-2 flex flex-col gap-2">
                <div className="text-[11.5px] text-text2">Select reputation points — you currently have <strong className="text-accent">340 pts</strong></div>
                <div className="flex gap-1.5 flex-wrap">
                  {[50, 100, 150, 200, 300].map(pts => (
                    <button key={pts} onClick={() => setBountyAmount(pts)} className={`py-1 px-3 rounded-md text-xs font-bold border-[1.5px] font-mono cursor-pointer transition-all ${bountyAmount === pts ? 'bg-accent/[0.14] border-accent text-accent' : 'bg-bg3 border-border text-text2 hover:border-accent hover:text-accent'}`}>+{pts}</button>
                  ))}
                </div>
                <div className="text-[11px] text-text3 leading-relaxed">⚡ Points are deducted immediately and awarded to the best answer within 7 days.</div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 px-5 border-t border-border flex items-center justify-between flex-wrap gap-2">
          <button onClick={close} className="py-1.5 px-3.5 rounded-[7px] text-xs font-medium bg-bg3 border border-border text-text2 cursor-pointer">Cancel</button>
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <span className="text-[11px] text-text3 flex items-center gap-1">⭐ AI summary auto-generated</span>
            <button onClick={postQuestion} disabled={loading} className="py-1.5 px-4.5 rounded-[7px] text-xs font-semibold bg-btn-bg text-btn-text border-none cursor-pointer flex items-center gap-1.5 disabled:opacity-50">
              ✈️ Post Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

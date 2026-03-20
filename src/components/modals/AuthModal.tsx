import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, Github } from 'lucide-react';

export default function AuthModal() {
  const { showAuth, authTab, closeAuth, login, register, openAuth } = useAuth();
  const [tab, setTab] = useState<'signup' | 'login'>(authTab);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  if (!showAuth) return null;

  const currentTab = tab;

  const handleSubmit = async () => {
    setError('');
    if (currentTab === 'signup') {
      if (!formData.username || !formData.email || !formData.password) { setError('All fields are required.'); return; }
      setLoading(true);
      const res = await register(formData.username, formData.email, formData.password);
      setLoading(false);
      if (res.success) { closeAuth(); } else { setError(res.message || 'Registration failed.'); }
    } else {
      if (!formData.email || !formData.password) { setError('Email and password are required.'); return; }
      setLoading(true);
      const res = await login(formData.email, formData.password);
      setLoading(false);
      if (res.success) { closeAuth(); } else { setError(res.message || 'Login failed.'); }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[500] flex items-center justify-center p-5" onClick={(e) => e.target === e.currentTarget && closeAuth()}>
      <div className="bg-bg2 border border-border2 rounded-2xl w-full max-w-[390px] shadow-card animate-modalIn">
        <div className="pt-6 px-6 text-center">
          <div className="font-syne text-[19px] font-extrabold text-foreground mb-1">DevForum</div>
          <p className="text-[12.5px] text-text2 mb-5">Premier Technical Q&A Community</p>
        </div>

        <div className="flex border-b border-border mx-6">
          {(['signup', 'login'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }} className={`flex-1 py-2.5 text-center text-[13px] font-semibold cursor-pointer border-b-2 transition-all -mb-px ${currentTab === t ? 'text-foreground border-accent2' : 'text-text3 border-transparent'}`}>
              {t === 'signup' ? 'Sign Up' : 'Log In'}
            </button>
          ))}
        </div>

        <div className="px-6 pb-6 flex flex-col gap-3 pt-4">
          <button className="w-full py-2 rounded-sm text-[12.5px] font-medium bg-bg3 border border-border text-foreground cursor-pointer flex items-center justify-center gap-2 hover:bg-bg4 transition-all">
            <Github className="w-[15px] h-[15px]" /> Continue with GitHub
          </button>

          <div className="flex items-center gap-2.5 text-[11px] text-text3">
            <span className="flex-1 h-px bg-border" /><span>or</span><span className="flex-1 h-px bg-border" />
          </div>

          {currentTab === 'signup' && (
            <div className="flex flex-col gap-[5px]">
              <label className="text-[11.5px] font-semibold text-text2">Username</label>
              <input className="bg-bg3 border border-border rounded-sm py-2 px-3 text-foreground text-[13px] outline-none focus:border-accent2 placeholder:text-text3" placeholder="Choose a username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
            </div>
          )}

          <div className="flex flex-col gap-[5px]">
            <label className="text-[11.5px] font-semibold text-text2">Email</label>
            <input className="bg-bg3 border border-border rounded-sm py-2 px-3 text-foreground text-[13px] outline-none focus:border-accent2 placeholder:text-text3" type="email" placeholder="you@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>

          <div className="flex flex-col gap-[5px]">
            <label className="text-[11.5px] font-semibold text-text2 flex items-center justify-between">
              Password
              {currentTab === 'login' && <span className="text-accent2 text-[10.5px] cursor-pointer font-medium">Forgot password?</span>}
            </label>
            <input className="bg-bg3 border border-border rounded-sm py-2 px-3 text-foreground text-[13px] outline-none focus:border-accent2 placeholder:text-text3" type="password" placeholder={currentTab === 'signup' ? 'Create a password' : '••••••••'} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>

          {error && <p className="text-danger text-[11.5px] text-center">{error}</p>}

          <button onClick={handleSubmit} disabled={loading} className="w-full py-[9px] rounded-[7px] text-xs font-semibold bg-btn-bg text-btn-text border-none cursor-pointer disabled:opacity-50">
            {loading ? 'Please wait…' : currentTab === 'signup' ? 'Create Free Account' : 'Log In'}
          </button>

          <p className="text-center text-[11.5px] text-text3">
            {currentTab === 'signup' ? (
              <>Already have an account? <span className="text-accent2 cursor-pointer font-semibold" onClick={() => setTab('login')}>Log in</span></>
            ) : (
              <>Don't have an account? <span className="text-accent2 cursor-pointer font-semibold" onClick={() => setTab('signup')}>Sign up free</span></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

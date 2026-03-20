import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Bookmark, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.png';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, isLoggedIn, openAuth, logout } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const savedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (savedRef.current && !savedRef.current.contains(e.target as Node)) setSavedOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] h-14 bg-nav-bg border-b border-white/[0.06] flex items-center px-4 gap-3">
      <button onClick={onToggleSidebar} className="w-9 h-9 rounded-lg bg-white/[0.08] border border-white/[0.11] flex flex-col items-center justify-center gap-[4.5px] flex-shrink-0 cursor-pointer">
        <Menu className="w-4 h-4 text-white/85" />
      </button>

      <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => window.location.hash = '#/home'}>
        <img src={logo} alt="Technical Forums" className="h-9" />
      </div>

      <div className="flex-1" />

      <div className="flex-1 max-w-[460px] relative hidden md:block">
        <input type="text" placeholder="Search questions, tags, users..." className="w-full h-[34px] bg-white/[0.09] border border-white/[0.13] rounded-full px-3.5 pr-9 text-white font-figtree text-[13px] outline-none focus:border-accent placeholder:text-white/[0.38]" />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/45 pointer-events-none" />
      </div>

      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={(e) => { e.stopPropagation(); setSavedOpen(false); setNotifOpen(!notifOpen); }} className="w-[34px] h-[34px] rounded-lg bg-white/[0.08] border border-white/[0.11] flex items-center justify-center text-white/70 hover:bg-white/[0.15] hover:text-white transition-all relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-[15px] h-[15px] rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center">3</span>
          </button>
          {notifOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-[300px] bg-bg3 border border-border2 rounded-lg shadow-card z-[300] overflow-hidden animate-fadeUp">
              <div className="p-2.5 px-3.5 border-b border-border font-syne text-[12.5px] font-bold text-foreground flex items-center justify-between">
                Notifications <span className="text-[10.5px] font-medium text-accent2 cursor-pointer">Mark all read</span>
              </div>
              {[
                { text: <><strong>devkaran</strong> answered your question about async/await</>, time: '3 min ago', unread: true },
                { text: <>Your question got <strong>+12 votes</strong></>, time: '1h ago', unread: true },
                { text: <>You earned <strong>Top Contributor</strong> badge</>, time: '2h ago', unread: true },
              ].map((n, i) => (
                <div key={i} className={`p-2.5 px-3.5 flex gap-2.5 items-start border-b border-border cursor-pointer hover:bg-bg4 ${n.unread ? 'bg-primary/5' : ''}`}>
                  <div className={`w-[7px] h-[7px] rounded-full mt-1 flex-shrink-0 ${n.unread ? 'bg-accent2' : 'bg-transparent'}`} />
                  <div className="flex-1">
                    <p className="text-xs text-foreground leading-relaxed mb-0.5">{n.text}</p>
                    <span className="text-[10.5px] text-text3">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved */}
        <div className="relative" ref={savedRef}>
          <button onClick={(e) => { e.stopPropagation(); setNotifOpen(false); setSavedOpen(!savedOpen); }} className="w-[34px] h-[34px] rounded-lg bg-white/[0.08] border border-white/[0.11] flex items-center justify-center text-white/70 hover:bg-white/[0.15] hover:text-white transition-all">
            <Bookmark className="w-4 h-4" />
          </button>
          {savedOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-[300px] bg-bg3 border border-border2 rounded-lg shadow-card z-[300] overflow-hidden animate-fadeUp">
              <div className="p-2.5 px-3.5 border-b border-border font-syne text-[12.5px] font-bold text-foreground">Saved Questions</div>
              <div className="p-2.5 px-3.5 flex gap-2.5 items-start border-b border-border cursor-pointer hover:bg-bg4">
                <div className="flex-1">
                  <p className="text-xs text-foreground leading-relaxed mb-0.5">async/await setTimeout error handling</p>
                  <span className="text-[10.5px] text-text3">Saved 3h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-white text-[13px] font-semibold">
              <div className="w-7 h-7 rounded-full bg-accent2 text-white flex items-center justify-center font-bold text-xs">
                {(user?.username?.[0] || 'U').toUpperCase()}
              </div>
              <span className="hidden sm:inline">{user?.username}</span>
            </div>
            <button onClick={logout} className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold bg-transparent border border-white/20 text-white/85 hover:bg-white/[0.09] hover:text-white cursor-pointer transition-all whitespace-nowrap">
              Log Out
            </button>
          </div>
        ) : (
          <>
            <button onClick={() => openAuth('signup')} className="px-4 py-1.5 rounded-full text-[13px] font-semibold bg-btn-bg text-btn-text border-none cursor-pointer hover:opacity-[0.88] transition-opacity whitespace-nowrap hidden sm:block">
              Sign Up
            </button>
            <button onClick={() => openAuth('login')} className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold bg-transparent border border-white/20 text-white/85 hover:bg-white/[0.09] hover:text-white cursor-pointer transition-all whitespace-nowrap">
              Log In
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

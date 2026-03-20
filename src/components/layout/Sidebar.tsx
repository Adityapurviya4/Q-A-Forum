import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, TrendingUp, Bookmark, Tag, Monitor, FlaskConical, Star, DollarSign, Users as UsersIcon, Globe, BarChart3, Bell, Bot, Sun, Moon, Plus, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface SidebarProps {
  collapsed: boolean;
  isMobile: boolean;
  onClose?: () => void;
}

const discoverItems = [
  { id: 'home', label: 'Home', icon: Home, path: '/' },
  { id: 'all', label: 'All Questions', icon: LayoutGrid, path: '/all', count: '24k' },
  { id: 'popular', label: 'Popular', icon: TrendingUp, path: '/popular' },
  { id: 'saved', label: 'Saved', icon: Bookmark, path: '/saved' },
  { id: 'tags', label: 'Tags', icon: Tag, path: '/tags', count: '24k' },
];

const topicItems = [
  { id: 'technology', label: 'Technology', icon: Monitor, path: '/topic/technology', count: '8.2k' },
  { id: 'science', label: 'Science', icon: FlaskConical, path: '/topic/science', count: '3.1k' },
  { id: 'engineering', label: 'Engineering', icon: Star, path: '/topic/engineering', count: '5.4k' },
  { id: 'business', label: 'Business', icon: DollarSign, path: '/topic/business', count: '2.8k' },
  { id: 'design', label: 'Design', icon: UsersIcon, path: '/topic/design', count: '1.4k' },
  { id: 'society', label: 'Society', icon: Globe, path: '/topic/society', count: '1.9k' },
];

const adminItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard' },
  { id: 'users', label: 'Users', icon: UsersIcon, path: '/users', count: '12k' },
  { id: 'admin-notif', label: 'Notifications', icon: Bell, path: '/admin-notifications', count: '12', countStyle: 'bg-danger/20 text-danger' },
];

const aiItems = [
  { id: 'ai', label: 'AI Assist', icon: Bot, path: '/ai', count: 'New', countStyle: 'bg-ai/20 text-ai' },
];

export default function Sidebar({ collapsed, isMobile, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [myTags, setMyTags] = useState(['react', 'nodejs', 'typescript', 'docker']);

  const navTo = (path: string) => {
    navigate(path);
    if (isMobile && onClose) onClose();
  };

  const isActive = (path: string) => location.pathname === path;

  const SidebarItem = ({ item }: { item: typeof discoverItems[0] & { countStyle?: string } }) => (
    <button
      onClick={() => navTo(item.path)}
      className={`flex items-center gap-2 px-2.5 py-[7px] rounded-sm text-sb-text cursor-pointer text-[12.5px] font-medium transition-all relative border-none bg-transparent w-full text-left font-figtree hover:bg-sb-item-hover hover:text-sb-text-active ${isActive(item.path) ? 'bg-sb-item-active text-sb-text-active' : ''}`}
    >
      {isActive(item.path) && <div className="absolute left-0 top-[22%] bottom-[22%] w-[3px] rounded-sm bg-sb-item-active-bar" />}
      <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{item.label}</span>
      {item.count && (
        <span className={`ml-auto text-[10px] font-semibold px-1.5 py-px rounded-[7px] ${(item as any).countStyle || 'bg-sb-count-bg text-sb-count-color'}`}>
          {item.count}
        </span>
      )}
    </button>
  );

  const content = (
    <div className="flex flex-col gap-4 h-full">
      {/* Profile */}
      <div className="flex items-center gap-2 p-2 px-2 rounded-sm bg-sb-item-hover border border-border">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
          {(user?.username?.[0] || 'Y').toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-semibold text-sb-text-active truncate">{user?.username || 'yarwixanater'}</div>
          <div className="text-[10.5px] text-sb-text-label">@{user?.username || 'yarwix'} · {user?.points || 340} pts</div>
        </div>
      </div>

      {/* Discover */}
      <div>
        <div className="text-[9.5px] font-bold tracking-[1.3px] text-sb-text-label uppercase px-2 mb-0.5">Discover</div>
        {discoverItems.map(item => <SidebarItem key={item.id} item={item} />)}
      </div>

      {/* Topics */}
      <div>
        <div className="text-[9.5px] font-bold tracking-[1.3px] text-sb-text-label uppercase px-2 mb-0.5">Topics</div>
        {topicItems.map(item => <SidebarItem key={item.id} item={item} />)}
      </div>

      {/* My Tags */}
      <div>
        <div className="flex items-center justify-between px-2 mb-0.5">
          <span className="text-[9.5px] font-bold tracking-[1.3px] text-sb-text-label uppercase">My Tags</span>
          <button className="w-[18px] h-[18px] rounded-[5px] bg-sb-chip-bg border border-sb-chip-border flex items-center justify-center text-sb-text-label hover:bg-sb-item-active hover:text-sb-text-active transition-all">
            <Plus className="w-[9px] h-[9px]" />
          </button>
        </div>
        <div className="flex flex-wrap gap-[5px] px-1 mt-1.5">
          {myTags.map(tag => (
            <span key={tag} className="text-[10.5px] font-medium font-mono px-[7px] py-[2px] rounded-[5px] bg-sb-chip-bg border border-sb-chip-border text-sb-chip-color cursor-pointer hover:border-accent2 hover:text-accent2 transition-all flex items-center gap-[3px]">
              #{tag}
              <span onClick={() => setMyTags(t => t.filter(x => x !== tag))} className="text-[11px] text-sb-text-label cursor-pointer hover:text-danger">×</span>
            </span>
          ))}
        </div>
      </div>

      {/* Admin */}
      <div>
        <div className="text-[9.5px] font-bold tracking-[1.3px] text-sb-text-label uppercase px-2 mb-0.5">Admin</div>
        {adminItems.map(item => <SidebarItem key={item.id} item={item} />)}
      </div>

      {/* AI */}
      <div>
        <div className="text-[9.5px] font-bold tracking-[1.3px] text-sb-text-label uppercase px-2 mb-0.5">AI Features</div>
        {aiItems.map(item => <SidebarItem key={item.id} item={item} />)}
      </div>

      {/* Theme Toggle */}
      <div className="mt-auto pt-2.5 px-2.5 border-t border-border">
        <div className="flex items-center justify-between py-2">
          <span className="text-[11.5px] font-medium text-sb-text flex items-center gap-[7px]"><Sun className="w-[13px] h-[13px]" />Light</span>
          <button onClick={toggleTheme} className={`w-11 h-6 rounded-full relative cursor-pointer flex-shrink-0 border transition-all ${theme === 'dark' ? 'bg-primary border-primary' : 'bg-bg4 border-border'}`}>
            <div className={`w-[18px] h-[18px] rounded-full absolute top-[2px] transition-transform duration-250 ${theme === 'dark' ? 'translate-x-5 bg-white' : 'left-[3px] bg-white/55'}`} />
          </button>
          <span className="text-[11.5px] font-medium text-sb-text flex items-center gap-[7px]"><Moon className="w-[13px] h-[13px]" />Dark</span>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {!collapsed && <div className="fixed inset-0 bg-black/60 z-[199] backdrop-blur-sm" onClick={onClose} />}
        <aside className={`fixed top-0 left-0 h-full w-[260px] bg-sidebar-bg border-r border-border z-[200] transform transition-transform duration-300 pt-4 px-2.5 overflow-y-auto ${collapsed ? '-translate-x-full' : 'translate-x-0'}`}>
          <div className="flex justify-end mb-2">
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-bg3 border border-border flex items-center justify-center text-text2 hover:bg-bg4">
              <X className="w-4 h-4" />
            </button>
          </div>
          {content}
        </aside>
      </>
    );
  }

  return (
    <aside className={`flex-shrink-0 bg-sidebar-bg border-r border-border border-l-[3px] border-l-sb-item-active-bar sticky top-14 h-[calc(100vh-56px)] overflow-y-auto pt-4 px-2.5 flex flex-col gap-4 transition-all duration-300 ${collapsed ? 'w-0 min-w-0 opacity-0 p-0 overflow-hidden border-r-0 border-l-0 pointer-events-none' : 'w-[228px] min-w-[228px]'}`}>
      {content}
    </aside>
  );
}

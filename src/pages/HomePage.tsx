import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, TrendingUp, Users, Bell, Star, Clock, MessageSquare, Eye } from 'lucide-react';
import { useAskModal } from '@/components/modals/AskQuestionModal';
import { useAuth } from '@/contexts/AuthContext';
import QuestionCard from '@/components/QuestionCard';
import { API_URL } from '@/lib/api';

export default function HomePage() {
  const { open: openAsk } = useAskModal();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentQuestions, setRecentQuestions] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/questions?sort=newest&limit=3`)
      .then(r => r.json()).then(d => setRecentQuestions(d.questions || []))
      .catch(() => {});
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning,' : h < 17 ? 'Good afternoon,' : 'Good evening,';
  })();

  const kpis = [
    { val: '340', label: 'Reputation', color: '#98E2C3', delta: '↑ +28 today' },
    { val: '23', label: 'Questions Asked', color: '#7C83F5', delta: '↑ 2 this week' },
    { val: '57', label: 'Answers Given', color: '#F59E0B', delta: '↑ 4 this week' },
    { val: '142', label: 'Questions Today', color: '#06B6D4', delta: '↑ +18%' },
    { val: '3', label: 'Unread Notifs', color: '#EC4899', delta: '● New', deltaColor: 'text-danger' },
    { val: '9', label: 'Badges Earned', color: '#10B981', delta: '↑ 1 new' },
  ];

  return (
    <div className="animate-fadeUp">
      {/* Hero */}
      <div className="flex items-center justify-between gap-3.5 bg-gradient-to-br from-primary/[0.14] to-accent/[0.07] border border-primary/[0.18] rounded-lg p-4 md:p-5 mb-3.5 flex-wrap">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[17px] font-bold text-white flex-shrink-0 shadow-[0_0_0_3px_rgba(152,226,195,0.25)]">
            {(user?.username?.[0] || 'Y').toUpperCase()}
          </div>
          <div>
            <div className="text-[11.5px] text-text3 font-medium mb-0.5">{greeting}</div>
            <div className="font-syne text-[17px] font-extrabold text-foreground tracking-tight flex items-center gap-2 flex-wrap">
              {user?.username || 'yarwixanater'}
              <span className="text-[11px] font-semibold text-[#F59E0B] py-px px-[7px] rounded-[5px] bg-[#F59E0B]/[0.12] border border-[#F59E0B]/20">🔥 14-day streak</span>
            </div>
            <div className="text-xs text-text3 mt-0.5">You're ranked <strong className="text-accent">#128</strong> globally · <strong className="text-[#F59E0B]">Top Contributor</strong> badge earned</div>
          </div>
        </div>
        <button onClick={openAsk} className="py-[7px] px-4 rounded-2xl text-[12.5px] font-semibold bg-btn-bg text-btn-text border-none cursor-pointer flex items-center gap-[5px] hover:opacity-[0.88] transition-all flex-shrink-0">
          <Plus className="w-3 h-3" /> Ask Question
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-card border border-border rounded-sm p-3 text-center hover:border-border2 transition-all">
            <div className="font-syne text-xl font-extrabold leading-none mb-0.5" style={{ color: kpi.color }}>{kpi.val}</div>
            <div className="text-[9.5px] font-semibold uppercase tracking-[0.8px] text-text3">{kpi.label}</div>
            <div className={`text-[10px] font-medium mt-0.5 ${kpi.deltaColor || 'text-accent'}`}>{kpi.delta}</div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="flex gap-3.5 items-start flex-col lg:flex-row">
        {/* Left */}
        <div className="flex-1 min-w-0 flex flex-col gap-3">
          {/* Daily Goal */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-2.5 px-3.5 border-b border-border">
              <span className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 font-syne"><Clock className="w-[13px] h-[13px] text-[#F59E0B]" /> Daily Goal</span>
              <span className="text-[10.5px] text-text3">3 / 5 tasks done</span>
            </div>
            <div className="h-1.5 bg-bg4 rounded mx-3.5 mt-2.5 mb-2 overflow-hidden"><div className="h-full rounded bg-gradient-to-r from-primary to-accent w-[60%] transition-all duration-600" /></div>
            <div className="px-3.5 pb-2 flex flex-col gap-1">
              {[{ text: 'Answer 1 question', done: true }, { text: 'Vote on 3 posts', done: true }, { text: 'Leave a comment', done: true }, { text: 'Ask a question', done: false }, { text: 'Earn 10 reputation', done: false }].map((task, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs ${task.done ? 'text-text3 line-through' : 'text-text2'}`}>
                  {task.done ? <span className="w-4 h-4 rounded bg-accent/20 border-[1.5px] border-accent flex items-center justify-center text-[9px] text-accent flex-shrink-0">✓</span> : <span className="w-4 h-4 rounded border-[1.5px] border-border2 flex-shrink-0" />}
                  {task.text}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Questions */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-2.5 px-3.5 border-b border-border">
              <span className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 font-syne"><MessageSquare className="w-[13px] h-[13px] text-accent" /> Recent Questions</span>
            </div>
            <div className="p-2">
              {recentQuestions.length > 0 ? recentQuestions.map(q => <QuestionCard key={q._id} question={q} />) : (
                <div className="py-8 text-center text-text3 text-[13px]">No questions loaded — is the server running?</div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-[260px] flex-shrink-0 flex flex-col gap-3">
          {/* Notifications */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-2.5 px-3.5 border-b border-border">
              <span className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 font-syne"><Bell className="w-[13px] h-[13px] text-danger" /> Notifications</span>
              <span className="text-[10px] font-semibold py-px px-2 rounded-[10px] bg-danger/[0.15] text-danger border border-danger/20">3 unread</span>
            </div>
            {[
              { av: 'D', grad: 'from-[#F59E0B] to-[#EF4444]', text: <><strong>devkaran</strong> answered your question about async/await</>, time: '3 min ago', unread: true },
              { av: '+', grad: 'from-accent to-primary', text: <>Your question got <strong>+12 votes</strong> 🎉</>, time: '1h ago', unread: true },
              { av: '🏆', grad: 'from-[#F59E0B] to-[#EC4899]', text: <>You earned <strong>Top Contributor</strong> badge</>, time: '2h ago', unread: true },
            ].map((n, i) => (
              <div key={i} className={`flex items-start gap-2 p-2 px-3 border-b border-border cursor-pointer hover:bg-bg3 transition-all ${n.unread ? 'bg-primary/[0.04]' : ''}`}>
                <div className={`w-[7px] h-[7px] rounded-full mt-[5px] flex-shrink-0 ${n.unread ? 'bg-accent2' : 'bg-transparent'}`} />
                <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 bg-gradient-to-br ${n.grad}`}>{n.av}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] text-foreground leading-[1.4] mb-0.5">{n.text}</p>
                  <span className="text-[10px] text-text3">{n.time}</span>
                </div>
              </div>
            ))}
            <div className="p-2 px-3 border-t border-border">
              <span className="text-xs font-semibold text-accent2 cursor-pointer hover:opacity-75" onClick={() => navigate('/admin-notifications')}>View all notifications →</span>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-2.5 px-3.5 border-b border-border">
              <span className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 font-syne"><Star className="w-[13px] h-[13px] text-[#F59E0B]" /> Your Badges</span>
              <span className="text-[10px] font-semibold py-px px-2 rounded-[10px] bg-bg3 border border-border text-text3">9 total</span>
            </div>
            <div className="grid grid-cols-3 gap-[7px] p-2.5 px-3">
              {[{ icon: '🏆', name: 'Top Contributor' }, { icon: '🔥', name: 'On Fire' }, { icon: '⭐', name: 'Rising Star', glow: true }, { icon: '💡', name: 'Enlightened' }, { icon: '👍', name: 'Popular' }, { icon: '❓', name: 'Inquisitive' }].map((b, i) => (
                <div key={i} className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg bg-bg3 border border-border cursor-pointer hover:border-border2 hover:-translate-y-px transition-all ${b.glow ? 'border-[#F59E0B]/40 bg-[#F59E0B]/[0.07] animate-glow' : ''}`}>
                  <span className="text-lg">{b.icon}</span>
                  <span className="text-[9.5px] text-text3 font-semibold text-center leading-[1.2]">{b.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trending */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-2.5 px-3.5 border-b border-border">
              <span className="text-[12.5px] font-bold text-foreground flex items-center gap-1.5 font-syne"><TrendingUp className="w-[13px] h-[13px] text-[#EC4899]" /> Trending in Your Topics</span>
            </div>
            {[
              { rank: 1, title: "async/await won't catch setTimeout errors", tag: 'javascript', votes: '2.3k', color: '#F59E0B', hot: true },
              { rank: 2, title: 'React 19 migration guide under 2 hours', tag: 'react', votes: '1.8k', color: '#94A3B8' },
              { rank: 3, title: 'Redis vs Memcached at 500k req/s', tag: 'redis', votes: '910', color: '#CD7F32' },
              { rank: 4, title: 'TypeScript 5.5 satisfies operator deep dive', tag: 'typescript', votes: '742' },
              { rank: 5, title: 'Next.js App Router vs Pages Router in 2025', tag: 'next.js', votes: '631', bounty: true },
            ].map(item => (
              <div key={item.rank} className="flex items-center gap-2 py-[7px] px-3 cursor-pointer hover:bg-bg3 transition-all">
                <span className="font-mono text-[11px] font-extrabold w-5 flex-shrink-0 text-center" style={{ color: item.color || 'var(--text3)' }}>{item.rank}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11.5px] font-medium text-foreground truncate mb-0.5">{item.title}</div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9.5px] py-px px-2 rounded bg-tag-bg border border-tag-border text-tag-color font-mono">{item.tag}</span>
                    <span className="text-[10px] text-text3">{item.votes} votes</span>
                  </div>
                </div>
                {item.hot && <span className="text-[8.5px]">🔥</span>}
                {item.bounty && <span className="text-[8.5px] font-bold py-px px-[7px] rounded bg-accent/[0.12] border border-accent/25 text-accent uppercase">Bounty</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

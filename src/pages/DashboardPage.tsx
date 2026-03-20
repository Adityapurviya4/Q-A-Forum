export default function DashboardPage() {
  const dashCards = [
    { label: 'Total Questions', val: '24,412', delta: '↑ +142 today', up: true, color: '#7C83F5' },
    { label: 'Total Answers', val: '87,631', delta: '↑ +398 today', up: true, color: '#98E2C3' },
    { label: 'Registered Users', val: '12,048', delta: '↑ +24 today', up: true, color: '#F59E0B' },
    { label: 'Flagged Content', val: '17', delta: '↑ +3 today', up: false, color: '#F87171' },
  ];

  const recentQuestions = [
    { title: 'async/await not catching setTimeout errors', author: 'devkaran', topic: 'Technology', status: 'Active' },
    { title: 'React 19 migration guide', author: 'sarah_kim', topic: 'Technology', status: 'Active' },
    { title: 'Saga vs 2PC for microservices', author: 'arch_sam', topic: 'Engineering', status: 'Active' },
    { title: 'B2B SaaS Series A timing', author: 'founder_z', topic: 'Business', status: 'Pending' },
    { title: 'AI governance for elections', author: 'ethics_io', topic: 'Society', status: 'Pending' },
    { title: 'Offensive WCAG violation report', author: '[deleted]', topic: 'Design', status: 'Removed' },
  ];

  const topTopics = [
    { name: 'Technology', pct: 88, count: '8.2k', grad: 'from-primary to-accent' },
    { name: 'Engineering', pct: 58, count: '5.4k', grad: 'from-[#F59E0B] to-[#EC4899]' },
    { name: 'Science', pct: 34, count: '3.1k', grad: 'from-[#10B981] to-[#06B6D4]' },
    { name: 'Business', pct: 30, count: '2.8k', grad: 'from-[#10B981] to-[#F59E0B]' },
    { name: 'Society', pct: 21, count: '1.9k', grad: 'from-[#6366F1] to-[#0EA5E9]' },
    { name: 'Design', pct: 15, count: '1.4k', grad: 'from-[#EC4899] to-[#8B5CF6]' },
  ];

  const statusClass: Record<string, string> = {
    Active: 'bg-accent/[0.15] text-accent',
    Pending: 'bg-[#F59E0B]/[0.15] text-[#F59E0B]',
    Removed: 'bg-danger/[0.12] text-danger',
  };

  return (
    <div className="animate-fadeUp">
      <div className="py-5 border-b border-border mb-5">
        <div className="font-syne text-[22px] font-extrabold text-foreground tracking-tight mb-1">Admin Dashboard</div>
        <div className="text-[12.5px] text-text3">Overview of platform activity — March 2026</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
        {dashCards.map((card, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-4 relative overflow-hidden hover:border-border2 transition-all">
            <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: card.color }} />
            <div className="text-[11px] text-text3 font-medium uppercase tracking-[0.8px]">{card.label}</div>
            <div className="font-syne text-[26px] font-extrabold text-foreground my-2">{card.val}</div>
            <div className={`text-[11px] font-semibold ${card.up ? 'text-accent' : 'text-danger'}`}>{card.delta}</div>
          </div>
        ))}
      </div>

      {/* Activity chart */}
      <div className="flex items-center justify-between mb-3"><div className="font-syne text-[15px] font-bold text-foreground">Activity — Last 7 Days</div></div>
      <div className="bg-card border border-border rounded-lg p-4 mb-5">
        <div className="flex items-end gap-1.5 h-20 px-1">
          {[45, 62, 50, 78, 55, 90, 100].map((h, i) => (
            <div key={i} className={`flex-1 rounded-t cursor-pointer hover:opacity-70 transition-all ${i === 6 ? 'bg-gradient-to-b from-accent to-accent/40' : 'bg-gradient-to-b from-primary to-primary/40'}`} style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="flex gap-1.5 mt-1.5 px-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} className="flex-1 text-center text-[9.5px] text-text3">{d}</div>)}
        </div>
      </div>

      {/* Recent Questions */}
      <div className="flex items-center justify-between mb-3"><div className="font-syne text-[15px] font-bold text-foreground">Recent Questions</div><span className="text-xs font-semibold text-accent2 cursor-pointer">View all →</span></div>
      <div className="bg-card border border-border rounded-lg overflow-hidden mb-5">
        <div className="grid grid-cols-[2fr_1fr_1fr_80px] p-2.5 px-3.5 border-b border-border text-[10px] font-bold tracking-[1px] uppercase text-text3">
          <span>Question</span><span className="hidden md:block">Author</span><span className="hidden md:block">Topic</span><span>Status</span>
        </div>
        {recentQuestions.map((q, i) => (
          <div key={i} className="grid grid-cols-[2fr_1fr_1fr_80px] p-2.5 px-3.5 border-b border-border last:border-b-0 items-center cursor-pointer hover:bg-bg3 transition-all">
            <span className="text-[12.5px] text-foreground font-medium truncate">{q.title}</span>
            <span className="text-xs text-text2 hidden md:block">{q.author}</span>
            <span className="text-xs text-text2 hidden md:block">{q.topic}</span>
            <span><span className={`text-[10px] font-semibold py-px px-2 rounded-[10px] ${statusClass[q.status]}`}>{q.status}</span></span>
          </div>
        ))}
      </div>

      {/* Top Topics */}
      <div className="font-syne text-[15px] font-bold text-foreground mb-3">Top Topics This Week</div>
      <div className="bg-card border border-border rounded-lg p-3.5 px-4 flex flex-col gap-2 mb-5">
        {topTopics.map(t => (
          <div key={t.name} className="flex items-center gap-2.5">
            <span className="text-xs text-foreground min-w-[90px]">{t.name}</span>
            <div className="flex-1 h-1.5 bg-bg4 rounded overflow-hidden">
              <div className={`h-full rounded bg-gradient-to-r ${t.grad}`} style={{ width: `${t.pct}%` }} />
            </div>
            <span className="text-[11px] text-text3 min-w-[36px] text-right">{t.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

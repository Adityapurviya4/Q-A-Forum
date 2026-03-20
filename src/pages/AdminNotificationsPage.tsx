import { useState } from 'react';
import { toast } from 'sonner';

const notifications = [
  { icon: '🚨', iconClass: 'bg-danger/12', title: 'Content Flagged: Spam detected in Technology topic', desc: 'User spam_bot99 posted 14 near-identical questions. Auto-flagged by spam detection.', time: '5 minutes ago', tags: ['Spam', 'Technology'], unread: true, actions: [{ label: 'Remove Content', primary: true }, { label: 'Ban User' }, { label: 'Dismiss' }] },
  { icon: '⚠️', iconClass: 'bg-[#F59E0B]/12', title: 'Moderation Alert: Heated debate flagged in Society', desc: 'Question "AI governance for elections" has 847 reports. Thread auto-locked.', time: '18 minutes ago', tags: ['Moderation', 'Society'], unread: true, actions: [{ label: 'Review Thread', primary: true }, { label: 'Unlock Thread' }, { label: 'Dismiss' }] },
  { icon: '🤖', iconClass: 'bg-ai/12', title: 'AI Model Alert: Unusual answer pattern detected', desc: 'GPT-generated boilerplate from fake_expert_12 across 23 questions. Confidence: 94%.', time: '42 minutes ago', tags: ['AI Detection', 'Engineering'], unread: true, actions: [{ label: 'Suspend User', primary: true }, { label: 'Remove Answers' }, { label: 'Ignore' }] },
  { icon: '📊', iconClass: 'bg-primary/12', title: 'Weekly Report Ready: Platform analytics for March 8–15', desc: '24,412 questions (+8.2%), 87,631 answers (+12.1%), 12,048 users (+2.0%).', time: '1 hour ago', tags: ['Analytics', 'Weekly'], unread: true, actions: [{ label: 'Download Report', primary: true }, { label: 'View Details' }] },
  { icon: '⚖️', iconClass: 'bg-danger/12', title: 'DMCA Notice Received: Science question contains copyrighted figure', desc: 'Formal DMCA takedown for question #18432 in Science. Action required within 24h.', time: '2 hours ago', tags: ['Legal', 'DMCA'], unread: true, actions: [{ label: 'Take Down', primary: true }, { label: 'Review Legal' }] },
  { icon: '✅', iconClass: 'bg-accent/12', title: 'New Moderator Onboarded: sarah_kim accepted invitation', desc: 'sarah_kim accepted moderator role for Technology and Engineering topics.', time: '4 hours ago', tags: ['Team'], actions: [{ label: 'View Profile' }] },
  { icon: '🔧', iconClass: 'bg-primary/12', title: 'System Maintenance Completed: Database reindex finished', desc: '24.4M documents indexed. Search latency improved by 34%.', time: '6 hours ago', tags: ['System', 'Performance'] },
  { icon: '📈', iconClass: 'bg-[#F59E0B]/12', title: 'Traffic Spike: Society topic 3.2× normal volume', desc: 'Society topic at 3.2× traffic due to "AI governance" discussion. Peak: 2,400 users.', time: 'Yesterday', tags: ['Traffic', 'Society'] },
  { icon: '🎉', iconClass: 'bg-accent/12', title: 'Milestone: DevForum reached 12,000 registered users', desc: '12,000th user is new_dev_raj from Bangalore, India.', time: 'Yesterday', tags: ['Milestone'] },
];

export default function AdminNotificationsPage() {
  const [filter, setFilter] = useState('All');
  const filters = ['All (12)', 'Flags (5)', 'Reports (4)', 'System (3)', 'Unread (8)'];

  return (
    <div className="animate-fadeUp">
      <div className="py-5 border-b border-border mb-5">
        <div className="font-syne text-[22px] font-extrabold text-foreground tracking-tight mb-1">Notifications Center</div>
        <div className="text-[12.5px] text-text3">Manage platform alerts, send announcements, review flagged content</div>
      </div>

      {/* Compose */}
      <div className="bg-card border border-border rounded-lg p-4 mb-4">
        <div className="font-syne text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">📢 Broadcast Announcement</div>
        <div className="flex gap-2.5 flex-wrap">
          <input className="flex-[2] min-w-[200px] h-9 bg-bg3 border border-border rounded-sm px-3 text-foreground text-[13px] outline-none focus:border-accent2 placeholder:text-text3" placeholder="Announcement title..." />
          <select className="h-9 bg-bg3 border border-border rounded-sm px-2.5 text-text2 text-xs outline-none cursor-pointer">
            <option>All Users</option>{['Technology', 'Science', 'Engineering', 'Business', 'Society', 'Design'].map(t => <option key={t}>{t}</option>)}
          </select>
          <button onClick={() => toast.success('Announcement sent!')} className="py-[7px] px-4 rounded-2xl text-[12.5px] font-semibold bg-btn-bg text-btn-text border-none cursor-pointer hover:opacity-[0.88] transition-all flex-shrink-0">Send</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5 mb-3.5 flex-wrap">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`py-[5px] px-3 rounded-2xl text-xs font-medium border cursor-pointer transition-all whitespace-nowrap ${filter === f ? 'bg-btn-bg text-btn-text border-btn-bg font-semibold' : 'bg-bg3 border-border text-text2'}`}>{f}</button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="flex flex-col">
        {notifications.map((n, i) => (
          <div key={i} className={`bg-card border border-border p-3.5 px-4 flex gap-3 items-start cursor-pointer hover:bg-bg3 transition-all ${i === 0 ? 'rounded-t-lg' : ''} ${i === notifications.length - 1 ? 'rounded-b-lg' : ''} ${i > 0 ? 'border-t-0' : ''} ${n.unread ? 'bg-primary/[0.04]' : ''}`}>
            <div className={`w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-[17px] flex-shrink-0 ${n.iconClass}`}>{n.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-foreground mb-0.5 leading-[1.4]">{n.title}</div>
              <div className="text-xs text-text2 leading-relaxed mb-1.5">{n.desc}</div>
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <span className="text-[10.5px] text-text3">{n.time}</span>
                {n.tags?.map(tag => <span key={tag} className="text-[10px] font-semibold py-px px-[7px] rounded-[10px] bg-bg3 text-text3 border border-border">{tag}</span>)}
              </div>
              {n.actions && (
                <div className="flex gap-[5px] flex-wrap">
                  {n.actions.map((a, j) => (
                    <button key={j} onClick={() => toast.success('Action completed!')} className={`py-[3px] px-2.5 rounded-[5px] text-[11px] font-medium border cursor-pointer transition-all ${a.primary ? 'bg-btn-bg text-btn-text border-btn-bg hover:opacity-85' : 'bg-bg3 border-border text-text2 hover:bg-bg4 hover:text-foreground'}`}>{a.label}</button>
                  ))}
                </div>
              )}
            </div>
            {n.unread && <div className="w-2 h-2 rounded-full bg-accent2 flex-shrink-0 mt-[5px]" />}
          </div>
        ))}
      </div>
    </div>
  );
}

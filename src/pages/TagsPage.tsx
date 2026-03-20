import { useState } from 'react';
import { Plus } from 'lucide-react';

const TAGS = [
  { name: '#javascript', desc: "The world's most-used scripting language.", count: '18.4k questions', following: true },
  { name: '#python', desc: 'General-purpose language beloved for ML and data science.', count: '16.2k questions' },
  { name: '#react', desc: "Meta's component-based UI library.", count: '13.8k questions', following: true },
  { name: '#typescript', desc: 'Typed superset of JavaScript.', count: '11.4k questions', following: true },
  { name: '#node.js', desc: 'JavaScript runtime for server-side apps.', count: '9.9k questions' },
  { name: '#docker', desc: 'Platform for containerized applications.', count: '8.1k questions', following: true },
  { name: '#sql', desc: 'Standard language for relational databases.', count: '7.0k questions' },
  { name: '#kubernetes', desc: 'Container orchestration system.', count: '5.5k questions' },
  { name: '#rust', desc: 'Systems programming focused on safety.', count: '4.0k questions' },
  { name: '#go', desc: 'Compiled language for scalable backends.', count: '2.9k questions' },
  { name: '#redis', desc: 'In-memory data structure store.', count: '2.6k questions' },
  { name: '#postgresql', desc: 'Powerful open-source database.', count: '2.4k questions' },
  { name: '#next.js', desc: 'React framework with SSR.', count: '2.1k questions' },
  { name: '#aws', desc: 'Amazon cloud platform.', count: '1.9k questions' },
  { name: '#machine-learning', desc: 'AI that learns from experience.', count: '1.7k questions' },
  { name: '#graphql', desc: 'Query language for APIs.', count: '1.5k questions' },
  { name: '#devops', desc: 'Dev + ops practices.', count: '1.4k questions' },
  { name: '#security', desc: 'App security and encryption.', count: '980 questions' },
];

export default function TagsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [followState, setFollowState] = useState<Record<string, boolean>>(
    Object.fromEntries(TAGS.filter(t => t.following).map(t => [t.name, true]))
  );

  const filtered = TAGS.filter(t => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) && !t.desc.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'Following' && !followState[t.name]) return false;
    return true;
  });

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <div className="font-syne text-xl font-bold text-foreground tracking-tight">All Tags</div>
          <div className="text-[11.5px] text-text3">24,000+ tags across all topics</div>
        </div>
        <button className="py-[7px] px-4 rounded-2xl text-[12.5px] font-semibold bg-btn-bg text-btn-text border-none cursor-pointer flex items-center gap-[5px] hover:opacity-[0.88] transition-all flex-shrink-0">
          <Plus className="w-3 h-3" /> Add Tag
        </button>
      </div>

      <input type="text" placeholder="Search tags..." value={search} onChange={e => setSearch(e.target.value)} className="w-full h-9 bg-bg3 border border-border rounded-sm px-3 text-foreground text-[13px] outline-none focus:border-accent2 placeholder:text-text3 mb-4" />

      <div className="flex gap-[5px] mb-3.5 flex-wrap">
        {['All', 'Most Used', 'Following', 'Technology', 'Science', 'Engineering', 'Business'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`py-[5px] px-3 rounded-2xl text-xs font-medium border cursor-pointer transition-all ${filter === f ? 'bg-btn-bg text-btn-text border-btn-bg font-semibold' : 'bg-bg3 border-border text-text2'}`}>{f}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {filtered.map(tag => (
          <div key={tag.name} className="bg-card border border-border rounded-lg p-3.5 px-4 cursor-pointer hover:border-border2 hover:shadow-card hover:-translate-y-px transition-all animate-fadeUp">
            <div className="font-mono text-[13px] font-bold text-foreground mb-1">{tag.name}</div>
            <div className="text-[11.5px] text-text2 leading-relaxed mb-2.5 min-h-[34px]">{tag.desc}</div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-text3 font-medium">{tag.count}</span>
              <button onClick={() => setFollowState(s => ({ ...s, [tag.name]: !s[tag.name] }))} className={`text-[11px] font-semibold py-[3px] px-2.5 rounded-md border cursor-pointer transition-all ${followState[tag.name] ? 'bg-accent/[0.12] border-accent text-accent' : 'bg-bg3 border-border2 text-text2 hover:bg-accent2/10 hover:border-accent2 hover:text-accent2'}`}>
                {followState[tag.name] ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

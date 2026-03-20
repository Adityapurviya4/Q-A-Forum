import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuestionCard from '@/components/QuestionCard';
import { API_URL } from '@/lib/api';

const topicConfig: Record<string, { gradient: string; color: string; desc: string; stats: { questions: string; answers: string; contributors: string }; tabs: string[] }> = {
  technology: { gradient: 'from-primary/[0.18] to-accent/10', color: '#7C83F5', desc: 'Computers, software, hardware, AI, cloud computing, networking.', stats: { questions: '8.2k', answers: '31k', contributors: '4.1k' }, tabs: ['Newest', 'Most Voted', 'Unanswered', 'AI & ML', 'Cloud', 'Security'] },
  science: { gradient: 'from-[#10B981]/[0.15] to-[#06B6D4]/[0.08]', color: '#10B981', desc: 'Biology, chemistry, physics, mathematics, data science.', stats: { questions: '3.1k', answers: '9.8k', contributors: '1.2k' }, tabs: ['Newest', 'Biology', 'Physics', 'Chemistry', 'Math', 'Data Science'] },
  engineering: { gradient: 'from-[#F59E0B]/[0.14] to-[#EF4444]/[0.08]', color: '#F59E0B', desc: 'Software architecture, systems design, DevOps, infrastructure.', stats: { questions: '5.4k', answers: '19k', contributors: '2.9k' }, tabs: ['Newest', 'Architecture', 'DevOps', 'Systems Design', 'Hardware'] },
  business: { gradient: 'from-[#10B981]/[0.12] to-[#F59E0B]/[0.08]', color: '#10B981', desc: 'Startups, product management, SaaS, growth, finance.', stats: { questions: '2.8k', answers: '7.4k', contributors: '980' }, tabs: ['Newest', 'Startups', 'SaaS', 'Product', 'Finance', 'Strategy'] },
  design: { gradient: 'from-[#EC4899]/[0.14] to-[#8B5CF6]/[0.08]', color: '#EC4899', desc: 'UI/UX design, accessibility, design systems, typography.', stats: { questions: '1.4k', answers: '4.2k', contributors: '620' }, tabs: ['Newest', 'UI/UX', 'Accessibility', 'Figma', 'Design Systems'] },
  society: { gradient: 'from-[#6366F1]/[0.14] to-[#0EA5E9]/[0.08]', color: '#818CF8', desc: 'Ethics in tech, policy, digital rights, remote work, education.', stats: { questions: '1.9k', answers: '5.6k', contributors: '740' }, tabs: ['Newest', 'AI Ethics', 'Policy', 'Remote Work', 'Education'] },
};

export default function TopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const config = topicConfig[topicId || ''] || topicConfig.technology;
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/questions?topic=${topicId}&sort=newest&limit=30`)
      .then(r => r.json()).then(d => { setQuestions(d.questions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [topicId]);

  return (
    <div className="animate-fadeUp">
      {/* Hero */}
      <div className={`bg-gradient-to-br ${config.gradient} border rounded-lg p-5 md:p-6 mb-4 relative overflow-hidden`} style={{ borderColor: `${config.color}33` }}>
        <div className="text-[10px] font-bold tracking-[1.5px] uppercase mb-1.5 opacity-80" style={{ color: config.color }}>Topic</div>
        <div className="font-syne text-[22px] font-extrabold tracking-tight mb-1.5 text-foreground capitalize">{topicId}</div>
        <div className="text-[13px] leading-relaxed opacity-80 max-w-[500px] mb-3.5 text-foreground">{config.desc}</div>
        <div className="flex gap-4 flex-wrap">
          {[
            { val: config.stats.questions, label: 'Questions', color: config.color },
            { val: config.stats.answers, label: 'Answers', color: '#98E2C3' },
            { val: config.stats.contributors, label: 'Contributors', color: '#F59E0B' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col gap-0.5">
              <div className="font-syne text-lg font-extrabold" style={{ color: s.color }}>{s.val}</div>
              <div className="text-[10px] font-semibold tracking-[0.8px] uppercase opacity-65">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 flex-wrap overflow-x-auto">
        {config.tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`py-[5px] px-3.5 rounded-2xl text-xs font-medium border cursor-pointer transition-all whitespace-nowrap flex-shrink-0 ${activeTab === i ? 'bg-btn-bg text-btn-text border-btn-bg font-semibold' : 'bg-bg3 border-border text-text2 hover:text-foreground hover:border-border2'}`}>
            {tab}
          </button>
        ))}
      </div>

      {loading && <div className="py-10 text-center text-text3 text-[13px]">Loading…</div>}
      {!loading && questions.length === 0 && <div className="py-16 text-center text-text3 text-[13px]">No questions yet — be the first to ask!</div>}
      {!loading && questions.map(q => <QuestionCard key={q._id} question={q} />)}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import QuestionCard from '@/components/QuestionCard';
import { useAskModal } from '@/components/modals/AskQuestionModal';
import { API_URL } from '@/lib/api';

export default function PopularPage() {
  const { open: openAsk } = useAskModal();
  const [questions, setQuestions] = useState<any[]>([]);
  const [sort, setSort] = useState('votes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/questions?sort=${sort}&limit=30`)
      .then(r => r.json()).then(d => { setQuestions(d.questions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [sort]);

  const rankColors = ['#F59E0B', '#9CA3AF', '#CD7C2F'];
  const rankLabels = ['🥇 #1', '🥈 #2', '🥉 #3'];

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-syne text-xl font-bold text-foreground tracking-tight">Popular Questions</div>
          <div className="text-[11.5px] text-text3 mt-0.5">{questions.length} questions · {sort === 'votes' ? 'most voted' : sort}</div>
        </div>
        <button onClick={openAsk} className="py-[7px] px-4 rounded-2xl text-[12.5px] font-semibold bg-btn-bg text-btn-text border-none cursor-pointer flex items-center gap-[5px] hover:opacity-[0.88] transition-all flex-shrink-0">
          <Plus className="w-3 h-3" /> Ask Question
        </button>
      </div>
      <div className="flex items-center gap-[5px] mb-4 flex-wrap">
        {[{ key: 'votes', label: 'Most Voted' }, { key: 'views', label: 'Most Viewed' }, { key: 'newest', label: 'Newest' }, { key: 'bounty', label: 'Bounty' }].map(f => (
          <button key={f.key} onClick={() => setSort(f.key)} className={`py-[5px] px-3 rounded-2xl text-xs font-medium border cursor-pointer transition-all whitespace-nowrap ${sort === f.key ? 'bg-btn-bg text-btn-text border-btn-bg font-semibold' : 'bg-bg3 border-border text-text2 hover:border-border2 hover:text-foreground'}`}>{f.label}</button>
        ))}
      </div>
      {loading && <div className="py-10 text-center text-text3 text-[13px]">Loading popular questions…</div>}
      {!loading && questions.map((q, i) => (
        <QuestionCard key={q._id} question={q} rank={i < 3 ? { index: i, label: rankLabels[i], color: rankColors[i], sub: sort === 'votes' ? `${q.votes || 0} votes` : `${q.views || 0} views` } : undefined} />
      ))}
    </div>
  );
}

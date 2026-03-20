import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import QuestionCard from '@/components/QuestionCard';
import { useAskModal } from '@/components/modals/AskQuestionModal';
import { API_URL } from '@/lib/api';

export default function AllQuestionsPage() {
  const { open: openAsk } = useAskModal();
  const [questions, setQuestions] = useState<any[]>([]);
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true); setError('');
    fetch(`${API_URL}/questions?sort=${sort}&limit=30`)
      .then(r => r.json())
      .then(d => { setQuestions(d.questions || []); setLoading(false); })
      .catch(() => { setError('Could not load questions. Is the server running?'); setLoading(false); });
  }, [sort]);

  const filters = [
    { key: 'newest', label: 'Newest' },
    { key: 'votes', label: 'Most Voted' },
    { key: 'bounty', label: 'Bounty' },
    { key: 'views', label: 'Most Viewed' },
  ];

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-syne text-xl font-bold text-foreground tracking-tight">All Questions</div>
          <div className="text-[11.5px] text-text3 mt-0.5">24,412 questions · updated just now</div>
        </div>
        <button onClick={openAsk} className="py-[7px] px-4 rounded-2xl text-[12.5px] font-semibold bg-btn-bg text-btn-text border-none cursor-pointer flex items-center gap-[5px] hover:opacity-[0.88] transition-all flex-shrink-0">
          <Plus className="w-3 h-3" /> Ask Question
        </button>
      </div>

      <div className="flex items-center gap-[5px] mb-4 flex-wrap overflow-x-auto">
        {filters.map(f => (
          <button key={f.key} onClick={() => setSort(f.key)} className={`py-[5px] px-3 rounded-2xl text-xs font-medium border cursor-pointer transition-all whitespace-nowrap flex-shrink-0 ${sort === f.key ? 'bg-btn-bg text-btn-text border-btn-bg font-semibold' : 'bg-bg3 border-border text-text2 hover:border-border2 hover:text-foreground'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading && <div className="py-10 text-center text-text3 text-[13px]">Loading questions…</div>}
      {error && <div className="py-10 text-center text-danger text-[13px]">{error}</div>}
      {!loading && !error && questions.length === 0 && <div className="py-16 text-center text-text3 text-[13px]">No questions yet — be the first to ask!</div>}
      {!loading && questions.map(q => <QuestionCard key={q._id} question={q} />)}
    </div>
  );
}

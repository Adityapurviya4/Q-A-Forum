import { getSavedQuestions } from '@/lib/api';
import QuestionCard from '@/components/QuestionCard';

export default function SavedPage() {
  const saved = getSavedQuestions();

  return (
    <div className="animate-fadeUp">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="font-syne text-xl font-bold text-foreground tracking-tight">Saved Questions</div>
          <div className="text-[11.5px] text-text3 mt-0.5">{saved.length} question{saved.length === 1 ? '' : 's'} saved</div>
        </div>
      </div>
      {saved.length === 0 ? (
        <div className="py-16 text-center text-text3 text-[13px]">No saved questions yet — click Save on any question to add it here.</div>
      ) : (
        saved.map(q => <QuestionCard key={q._id} question={q} />)
      )}
    </div>
  );
}

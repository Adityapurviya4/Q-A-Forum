import { ChevronUp, ChevronDown, MessageSquare, Eye } from 'lucide-react';
import { timeAgo } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

interface QuestionCardProps {
  question: any;
  rank?: { index: number; label: string; color: string; sub?: string };
}

const typeLabels: Record<string, string> = { general: 'General', bug: 'Bug Report', feature: 'Feature Request', discussion: 'Discussion' };
const typeColors: Record<string, string> = { general: '#7C83F5', bug: '#F87171', feature: '#98E2C3', discussion: '#F59E0B' };

export default function QuestionCard({ question: q, rank }: QuestionCardProps) {
  const navigate = useNavigate();
  const initial = (q.author?.username || 'U')[0].toUpperCase();
  const time = q.createdAt ? timeAgo(new Date(q.createdAt)) : 'just now';

  return (
    <div className="bg-card border border-border rounded-lg mb-2 overflow-hidden hover:border-border2 hover:shadow-card transition-all animate-fadeUp cursor-pointer" onClick={() => navigate(`/question/${q._id}`)}>
      {rank && (
        <div className="px-4 pt-1.5">
          <span className="text-[11px] font-bold" style={{ color: rank.color }}>{rank.label}{rank.sub ? ` · ${rank.sub}` : ''}</span>
        </div>
      )}
      <div className="flex">
        {/* Vote col */}
        <div className="flex flex-col items-center gap-1 py-4 px-2.5 pl-3.5 flex-shrink-0 w-[52px]" onClick={e => e.stopPropagation()}>
          <button className="w-[30px] h-[30px] rounded-[7px] border border-border bg-bg3 flex items-center justify-center text-text3 hover:border-accent hover:text-accent hover:bg-accent/[0.08] transition-all">
            <ChevronUp className="w-[13px] h-[13px]" />
          </button>
          <span className="text-[13px] font-bold text-foreground font-syne text-center min-w-[20px]">{q.votes || 0}</span>
          <button className="w-[30px] h-[30px] rounded-[7px] border border-border bg-bg3 flex items-center justify-center text-text3 hover:border-danger hover:text-danger hover:bg-danger/[0.1] transition-all">
            <ChevronDown className="w-[13px] h-[13px]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-w-0 py-3.5 px-4 pr-4">
          <div className="flex items-center gap-[7px] mb-2 flex-wrap">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 bg-gradient-to-br from-primary to-accent">{initial}</div>
            <span className="text-[12.5px] font-semibold text-foreground">{q.author?.username || 'unknown'}</span>
            {q.type && (
              <span className="text-[10px] py-px px-[7px] rounded-[10px] font-semibold ml-1" style={{ background: `${typeColors[q.type] || '#7C83F5'}22`, color: typeColors[q.type] || '#7C83F5' }}>
                {typeLabels[q.type] || 'General'}
              </span>
            )}
            <span className="text-[11px] text-text3">{time}</span>
          </div>
          <div className="font-syne text-[14.5px] font-semibold text-foreground mb-2 leading-[1.4] hover:text-accent2 transition-colors">{q.title}</div>
          {q.tags && (
            <div className="flex flex-wrap gap-1 mb-2">
              {q.tags.map((t: string) => (
                <span key={t} className="text-[10.5px] py-px px-2 rounded bg-tag-bg border border-tag-border text-tag-color font-mono cursor-pointer hover:border-accent2 hover:text-accent2 transition-all">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="py-2 px-4 border-t border-border flex items-center gap-1 bg-bg2 flex-wrap">
        <div className="flex items-center gap-1 text-[11.5px] text-text3 py-[3px] px-2 rounded-[14px] bg-bg3 border border-border"><MessageSquare className="w-3 h-3" />{q.answerCount || 0}</div>
        <div className="flex items-center gap-1 text-[11.5px] text-text3 py-[3px] px-2 rounded-[14px] bg-bg3 border border-border"><Eye className="w-3 h-3" />{q.views || 0}</div>
        {q.bounty?.points > 0 && <span className="text-[9.5px] font-bold py-px px-[7px] rounded bg-accent/[0.12] border border-accent/25 text-accent uppercase tracking-[0.5px]">+{q.bounty.points} Bounty</span>}
        <button className="ml-auto py-1 px-2.5 rounded-[7px] text-[11.5px] font-semibold bg-bg3 border border-border text-text2 hover:bg-bg4 hover:text-foreground transition-all">View</button>
      </div>
    </div>
  );
}

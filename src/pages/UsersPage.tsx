import { useState } from 'react';
import { Plus, Search } from 'lucide-react';

const usersData = [
  { name: 'devkaran', email: 'dev@karan.io', av: 'D', grad: 'from-[#F59E0B] to-[#EF4444]', role: 'Moderator', roleClass: 'bg-[#F59E0B]/12 text-[#F59E0B]', questions: 142, points: '2,840', highlight: true },
  { name: 'sarah_kim', email: 'sarah@dev.io', av: 'S', grad: 'from-[#06B6D4] to-[#818CF8]', role: 'Moderator', roleClass: 'bg-[#F59E0B]/12 text-[#F59E0B]', questions: 87, points: '1,920', highlight: true },
  { name: 'yarwixanater', email: 'yarwix@dev.io', av: 'Y', grad: 'from-primary to-accent', role: 'Admin', roleClass: 'bg-ai/15 text-ai', questions: 23, points: '340', highlight: true },
  { name: 'marcus_dev', email: 'marcus@dev.io', av: 'M', grad: 'from-[#0EA5E9] to-[#6366F1]', role: 'User', roleClass: 'bg-bg3 text-text3 border border-border', questions: 56, points: '1,175' },
  { name: 'alicewang', email: 'alice@dev.io', av: 'A', grad: 'from-[#10B981] to-[#0EA5E9]', role: 'User', roleClass: 'bg-bg3 text-text3 border border-border', questions: 31, points: '780' },
  { name: 'prakash_io', email: 'prakash@dev.io', av: 'P', grad: 'from-[#8B5CF6] to-[#EC4899]', role: 'User', roleClass: 'bg-bg3 text-text3 border border-border', questions: 44, points: '930' },
  { name: 'ux_camila', email: 'camila@dev.io', av: 'U', grad: 'from-[#EC4899] to-[#8B5CF6]', role: 'User', roleClass: 'bg-bg3 text-text3 border border-border', questions: 18, points: '420' },
  { name: 'spam_bot99', email: 'spam@bot.io', av: 'X', grad: 'from-danger to-[#F59E0B]', role: 'Suspended', roleClass: 'bg-danger/15 text-danger', questions: 0, points: '0' },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const filtered = usersData.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-fadeUp">
      <div className="py-5 border-b border-border mb-5">
        <div className="font-syne text-[22px] font-extrabold text-foreground tracking-tight mb-1">User Management</div>
        <div className="text-[12.5px] text-text3">12,048 registered members · 340 active today</div>
      </div>

      <div className="flex items-center gap-2.5 mb-3.5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <input type="text" placeholder="Search users by name, email or username..." value={search} onChange={e => setSearch(e.target.value)} className="w-full h-9 bg-bg3 border border-border rounded-sm px-3 text-foreground text-[13px] outline-none focus:border-accent2 placeholder:text-text3" />
        </div>
        <select className="h-9 bg-bg3 border border-border rounded-sm px-2.5 text-text2 text-xs outline-none cursor-pointer"><option>All Roles</option><option>Admin</option><option>Moderator</option><option>User</option></select>
        <select className="h-9 bg-bg3 border border-border rounded-sm px-2.5 text-text2 text-xs outline-none cursor-pointer"><option>All Status</option><option>Active</option><option>Suspended</option></select>
        <button className="py-[7px] px-4 rounded-2xl text-[12.5px] font-semibold bg-btn-bg text-btn-text border-none cursor-pointer flex items-center gap-[5px] hover:opacity-[0.88] transition-all flex-shrink-0">
          <Plus className="w-3 h-3" /> Invite User
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[2fr_80px_80px] md:grid-cols-[2fr_1fr_1fr_1fr_80px] p-2.5 px-4 border-b border-border text-[10px] font-bold tracking-[1px] uppercase text-text3">
          <span>User</span><span>Role</span><span className="hidden md:block">Questions</span><span className="hidden md:block">Points</span><span>Actions</span>
        </div>
        {filtered.map((u, i) => (
          <div key={i} className="grid grid-cols-[2fr_80px_80px] md:grid-cols-[2fr_1fr_1fr_1fr_80px] p-3 px-4 border-b border-border last:border-b-0 items-center hover:bg-bg3 transition-all cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 bg-gradient-to-br ${u.grad}`}>{u.av}</div>
              <div>
                <div className="text-[12.5px] font-semibold text-foreground">{u.name}</div>
                <div className="text-[10.5px] text-text3">{u.email}</div>
              </div>
            </div>
            <span><span className={`text-[9.5px] font-semibold py-px px-2 rounded-[10px] ${u.roleClass}`}>{u.role}</span></span>
            <span className="text-xs text-text2 hidden md:block">{u.questions}</span>
            <span className={`text-xs hidden md:block ${u.highlight ? 'text-accent font-semibold' : 'text-text2'}`}>{u.points}</span>
            <div className="flex gap-[5px]">
              <button className="py-[3px] px-2 rounded-[5px] text-[11px] font-medium border border-border bg-bg3 text-text2 cursor-pointer hover:bg-bg4 hover:text-foreground transition-all">{u.role === 'Suspended' ? 'Restore' : 'Edit'}</button>
              {u.role !== 'Admin' && <button className="py-[3px] px-2 rounded-[5px] text-[11px] font-medium border border-border bg-bg3 text-text2 cursor-pointer hover:bg-danger/10 hover:text-danger hover:border-danger transition-all">{u.role === 'Suspended' ? 'Delete' : 'Ban'}</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

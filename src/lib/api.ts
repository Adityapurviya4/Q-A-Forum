export const API_URL = 'http://localhost:5000/api';

export function authSaveToken(t: string) { localStorage.setItem('df_token', t); }
export function authGetToken(): string | null { return localStorage.getItem('df_token'); }
export function authRemoveToken() { localStorage.removeItem('df_token'); }
export function authSaveUser(u: any) { localStorage.setItem('df_user', JSON.stringify(u)); }
export function authGetUser(): any { try { return JSON.parse(localStorage.getItem('df_user') || 'null'); } catch { return null; } }
export function authRemoveUser() { localStorage.removeItem('df_user'); }

export function getSavedQuestions(): any[] { try { return JSON.parse(localStorage.getItem('df_saved') || '[]'); } catch { return []; } }
export function setSavedQuestions(arr: any[]) { localStorage.setItem('df_saved', JSON.stringify(arr)); }

export function escHtml(str: string): string {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function timeAgo(date: Date): string {
  const sec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (sec < 60) return 'just now';
  if (sec < 3600) return Math.floor(sec / 60) + 'm ago';
  if (sec < 86400) return Math.floor(sec / 3600) + 'h ago';
  return Math.floor(sec / 86400) + 'd ago';
}

export function formatBytes(b: number): string {
  if (b < 1024) return b + 'B';
  if (b < 1048576) return (b / 1024).toFixed(1) + 'KB';
  return (b / 1048576).toFixed(1) + 'MB';
}

export async function apiFetch(path: string, options?: RequestInit) {
  const token = authGetToken();
  const headers: Record<string, string> = { ...((options?.headers as Record<string, string>) || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(`${API_URL}${path}`, { ...options, headers });
}

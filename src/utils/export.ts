import type { Vacation } from '../types/vacation';

export function exportJSON(vacation: Vacation): void {
  const blob = new Blob([JSON.stringify(vacation, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${vacation.title || 'vacation'}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

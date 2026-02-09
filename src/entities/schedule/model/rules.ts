import type { TimeTableEntry } from './types';

const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map((part) => Number(part));
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  return h * 60 + m;
};

export const hasSpecialConflicts = (items: TimeTableEntry[]): boolean => {
  const byDate = new Map<string, TimeTableEntry[]>();
  items.forEach((item) => {
    if (!item.date) return;
    const list = byDate.get(item.date) || [];
    list.push(item);
    byDate.set(item.date, list);
  });

  for (const entries of byDate.values()) {
    for (let i = 0; i < entries.length; i += 1) {
      const a = entries[i];
      for (let j = i + 1; j < entries.length; j += 1) {
        const b = entries[j];
        const aStart = toMinutes(a.openTime);
        const aEnd = toMinutes(a.closeTime);
        const bStart = toMinutes(b.openTime);
        const bEnd = toMinutes(b.closeTime);
        if (aStart < bEnd && bStart < aEnd) return true;
      }
    }
  }

  return false;
};

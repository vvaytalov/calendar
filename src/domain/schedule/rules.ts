import type { SpecialSchedule } from './types';

export const hasSpecialConflicts = (items: SpecialSchedule[]): boolean => {
  const overrides = items.filter((item) => item.isOverrideBase);
  for (let i = 0; i < overrides.length; i += 1) {
    for (let j = i + 1; j < overrides.length; j += 1) {
      const a = overrides[i];
      const b = overrides[j];
      const conflict =
        a.priority === b.priority &&
        new Date(a.dateFrom) < new Date(b.dateTo) &&
        new Date(b.dateFrom) < new Date(a.dateTo);

      if (conflict) return true;
    }
  }

  return false;
};

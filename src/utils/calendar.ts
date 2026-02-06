export const toDateInput = (value: string | Date | null | undefined): string =>
  value ? new Date(value).toISOString().slice(0, 10) : '';

export const formatDate = (value: string | Date | null | undefined): string =>
  value ? new Date(value).toLocaleDateString('ru-RU') : '—';

export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const dayNumber = (date: Date): number => {
  const raw = date.getDay();
  return raw === 0 ? 7 : raw;
};

export const inRange = (
  date: Date,
  from?: string | Date | null,
  to?: string | Date | null
): boolean => {
  const current = new Date(date.toDateString());
  const start = from ? new Date(from) : null;
  const end = to ? new Date(to) : null;

  if (start && current < new Date(start.toDateString())) return false;
  if (end && current > new Date(end.toDateString())) return false;

  return true;
};

export const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

export const formatDate = (value) => (value ? new Date(value).toLocaleDateString('ru-RU') : '—');

export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const dayNumber = (date) => {
  const raw = date.getDay();
  return raw === 0 ? 7 : raw;
};

export const inRange = (date, from, to) => {
  const current = new Date(date.toDateString());
  const start = from ? new Date(from) : null;
  const end = to ? new Date(to) : null;

  if (start && current < new Date(start.toDateString())) return false;
  if (end && current > new Date(end.toDateString())) return false;

  return true;
};

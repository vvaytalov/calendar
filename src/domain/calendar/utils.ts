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

export const toDateKey = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

export const getMonthCells = (year: number, monthIndex: number): Array<Date | null> => {
  const monthStart = new Date(year, monthIndex, 1);
  const monthEnd = new Date(year, monthIndex + 1, 0);
  const daysInMonth = monthEnd.getDate();
  const firstWeekDay = (monthStart.getDay() + 6) % 7;

  const cells: Array<Date | null> = [];
  for (let i = 0; i < firstWeekDay; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, monthIndex, day));

  return cells;
};

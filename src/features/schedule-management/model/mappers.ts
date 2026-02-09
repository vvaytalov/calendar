import { DAY_LABEL } from '../../../shared/config/calendarConstants';
import { formatDate } from '../../../shared/lib/dateFormat';
import type { BaseFormState, BaseCard, SpecialCard, SpecialFormState } from './types';
import type { DayNumber, TimeTableEntry } from '../../../entities/schedule/model/types';

const makeEntryId = (prefix: string, seed: string): string =>
  `${prefix}-${seed}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const buildDateRange = (from: string, to: string): string[] => {
  if (!from || !to) return [];
  const start = new Date(from);
  const end = new Date(to);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return [];
  const dates: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
};

const toDayNumber = (date: Date): DayNumber => {
  const jsDay = date.getDay(); // 0..6 (Sun..Sat)
  return (((jsDay + 6) % 7) + 1) as DayNumber; // 1..7 (Mon..Sun)
};

const buildDayRanges = (days: DayNumber[]): Array<{ from: DayNumber; to: DayNumber }> => {
  const sorted = [...new Set(days)].sort((a, b) => a - b);
  if (sorted.length === 0) return [];
  const ranges: Array<{ from: DayNumber; to: DayNumber }> = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i += 1) {
    const current = sorted[i];
    if (current === prev + 1) {
      prev = current;
      continue;
    }
    ranges.push({ from: start, to: prev });
    start = current;
    prev = current;
  }
  ranges.push({ from: start, to: prev });
  return ranges;
};

const formatDayRange = ({ from, to }: { from: DayNumber; to: DayNumber }): string =>
  from === to ? DAY_LABEL[from] : `${DAY_LABEL[from]} - ${DAY_LABEL[to]}`;

const buildDateRanges = (dates: string[]): Array<{ from: string; to: string }> => {
  const sorted = [...new Set(dates)].sort();
  if (sorted.length === 0) return [];
  const ranges: Array<{ from: string; to: string }> = [];
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i += 1) {
    const current = sorted[i];
    const prevDate = new Date(prev);
    const nextDate = new Date(prevDate);
    nextDate.setDate(prevDate.getDate() + 1);
    if (nextDate.toISOString().slice(0, 10) === current) {
      prev = current;
      continue;
    }
    ranges.push({ from: start, to: prev });
    start = current;
    prev = current;
  }
  ranges.push({ from: start, to: prev });
  return ranges;
};

const formatDateRange = ({ from, to }: { from: string; to: string }): string => {
  if (from === to) return formatDate(from);
  return `${formatDate(from)} - ${formatDate(to)}`;
};

export const toBaseCards = (items: TimeTableEntry[]): BaseCard[] => {
  const weekdayByTime: Record<string, Map<DayNumber, string>> = {};
  const weekendByTime: Record<string, Map<DayNumber, string>> = {};
  const dateByTime: Record<string, Map<string, string>> = {};

  items.forEach((item) => {
    const key = `${item.openTime}-${item.closeTime}`;
    if (item.date) {
      if (!dateByTime[key]) dateByTime[key] = new Map();
      dateByTime[key].set(item.date, item.id);
      return;
    }
    if (!item.day) return;
    const target = item.day >= 6 ? weekendByTime : weekdayByTime;
    if (!target[key]) target[key] = new Map();
    target[key].set(item.day, item.id);
  });

  const cards: BaseCard[] = [];

  const pushDayCards = (byTime: Record<string, Map<DayNumber, string>>, kind: BaseCard['kind']) => {
    Object.entries(byTime).forEach(([key, dayMap]) => {
      const [openTime, closeTime] = key.split('-');
      const timeLabel = `${openTime} - ${closeTime}`;
      const days = Array.from(dayMap.keys()).sort((a, b) => a - b);
      buildDayRanges(days).forEach((range, index) => {
        const ids: string[] = [];
        for (let day = range.from; day <= range.to; day += 1) {
          const id = dayMap.get(day as DayNumber);
          if (id) ids.push(id);
        }
        cards.push({
          id: `base-${key}-${kind}-${index}`,
          ids,
          kind,
          timeLabel,
          daysLabel: formatDayRange(range)
        });
      });
    });
  };

  pushDayCards(weekdayByTime, 'weekday');
  pushDayCards(weekendByTime, 'weekend');

  Object.entries(dateByTime).forEach(([key, dateMap]) => {
    const [openTime, closeTime] = key.split('-');
    const timeLabel = `${openTime} - ${closeTime}`;
    const dates = Array.from(dateMap.keys()).sort();
    buildDateRanges(dates).forEach((range, index) => {
      const ids: string[] = [];
      const cursor = new Date(range.from);
      const end = new Date(range.to);
      while (cursor <= end) {
        const date = cursor.toISOString().slice(0, 10);
        const id = dateMap.get(date);
        if (id) ids.push(id);
        cursor.setDate(cursor.getDate() + 1);
      }
      cards.push({
        id: `base-${key}-date-${index}`,
        ids,
        kind: 'date',
        timeLabel,
        daysLabel: formatDateRange(range)
      });
    });
  });

  return cards;
};

export const toSpecialCards = (items: TimeTableEntry[]): SpecialCard[] => {
  const dateByTime: Record<string, Map<string, string>> = {};
  items.forEach((item) => {
    if (!item.date) return;
    const key = `${item.openTime}-${item.closeTime}`;
    if (!dateByTime[key]) dateByTime[key] = new Map();
    dateByTime[key].set(item.date, item.id);
  });

  const cards: SpecialCard[] = [];
  Object.entries(dateByTime).forEach(([key, dateMap]) => {
    const [openTime, closeTime] = key.split('-');
    const timeLabel = `${openTime} - ${closeTime}`;
    const dates = Array.from(dateMap.keys()).sort();
    buildDateRanges(dates).forEach((range, index) => {
      const ids: string[] = [];
      const cursor = new Date(range.from);
      const end = new Date(range.to);
      while (cursor <= end) {
        const date = cursor.toISOString().slice(0, 10);
        const id = dateMap.get(date);
        if (id) ids.push(id);
        cursor.setDate(cursor.getDate() + 1);
      }
      cards.push({
        id: `special-${key}-${index}`,
        ids,
        dateLabel: formatDateRange(range),
        timeLabel
      });
    });
  });

  return cards;
};

export const buildWorkEntries = (form: BaseFormState): TimeTableEntry[] => {
  const selectedDays = form.sameAsWeekdays
    ? [...form.weekdayDays]
    : [...form.weekdayDays, ...form.weekendDays];
  const dateRange = buildDateRange(form.dateFrom, form.dateTo);
  if (dateRange.length > 0 && selectedDays.length > 0) {
    return dateRange.flatMap((date) => {
      const dayNum = toDayNumber(new Date(date));
      if (!selectedDays.includes(dayNum)) return [];
      const isWeekend = dayNum >= 6;
      const openTime =
        isWeekend && !form.sameAsWeekdays ? form.weekendTimeFrom : form.weekdayTimeFrom;
      const closeTime = isWeekend && !form.sameAsWeekdays ? form.weekendTimeTo : form.weekdayTimeTo;
      return [
        {
          id: makeEntryId('work', `${date}-${dayNum}`),
          day: null,
          date,
          openTime,
          closeTime
        }
      ];
    });
  }

  const weekdayEntries = form.weekdayDays.map((day) => ({
    id: makeEntryId('work', `wd-${day}`),
    day,
    date: null,
    openTime: form.weekdayTimeFrom,
    closeTime: form.weekdayTimeTo
  }));

  if (form.sameAsWeekdays) return weekdayEntries;

  const weekendEntries = form.weekendDays.map((day) => ({
    id: makeEntryId('work', `we-${day}`),
    day,
    date: null,
    openTime: form.weekendTimeFrom,
    closeTime: form.weekendTimeTo
  }));

  return [...weekdayEntries, ...weekendEntries];
};

export const buildSpecialEntries = (form: SpecialFormState): TimeTableEntry[] => {
  const dates = buildDateRange(form.dateFrom, form.dateTo);
  return dates.map((date, index) => ({
    id: makeEntryId('special', `${date}-${index}`),
    date,
    day: null,
    openTime: form.timeFrom,
    closeTime: form.timeTo
  }));
};

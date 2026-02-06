import type { BaseFormState, DayNumber, SpecialFormState } from '../types/schedule';

export const MONTHS: string[] = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь'
];

export const WEEKDAYS: string[] = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const DAY_LABEL: Record<DayNumber, string> = {
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб',
  7: 'Вс'
};

export const DAY_OPTIONS: Array<{ value: DayNumber; label: string }> = [
  { value: 1, label: 'Пн' },
  { value: 2, label: 'Вт' },
  { value: 3, label: 'Ср' },
  { value: 4, label: 'Чт' },
  { value: 5, label: 'Пт' },
  { value: 6, label: 'Сб' },
  { value: 7, label: 'Вс' }
];

export const BASE_FORM_TEMPLATE: BaseFormState = {
  scheduleType: 'base',
  weekdayTitle: 'Будние дни',
  weekdayFrom: '',
  weekdayTo: '',
  weekdayTimeFrom: '08:00',
  weekdayTimeTo: '20:00',
  weekdayDays: [1, 2, 3, 4, 5],
  weekendTitle: 'Выходные дни',
  weekendFrom: '',
  weekendTo: '',
  weekendTimeFrom: '10:00',
  weekendTimeTo: '18:00',
  weekendDays: [6, 7],
  sameAsWeekdays: false,
  recurrence: 'yearly'
};

export const SPECIAL_FORM_TEMPLATE: SpecialFormState = {
  title: 'Специальное расписание',
  dateFrom: '',
  dateTo: '',
  timeFrom: '09:00',
  timeTo: '18:00',
  recurrence: 'none'
};

import type { BaseFormState, SpecialFormState } from './types';

export const createBaseFormState = (): BaseFormState => ({
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
});

export const createSpecialFormState = (): SpecialFormState => ({
  title: 'Специальное расписание',
  dateFrom: '',
  dateTo: '',
  timeFrom: '09:00',
  timeTo: '18:00',
  recurrence: 'none'
});

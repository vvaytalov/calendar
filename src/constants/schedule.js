export const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const DAY_LABEL = {
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб',
  7: 'Вс'
};

<<<<<<< codex/implement-schedule-management-for-zone24-cpj0ux
export const DAY_OPTIONS = [
  { value: 1, label: 'Пн' },
  { value: 2, label: 'Вт' },
  { value: 3, label: 'Ср' },
  { value: 4, label: 'Чт' },
  { value: 5, label: 'Пт' },
  { value: 6, label: 'Сб' },
  { value: 7, label: 'Вс' }
];

=======
>>>>>>> main
export const BASE_FORM_TEMPLATE = {
  weekdayTitle: 'Будние дни',
  weekdayFrom: '',
  weekdayTo: '',
  weekdayTimeFrom: '08:00',
  weekdayTimeTo: '20:00',
<<<<<<< codex/implement-schedule-management-for-zone24-cpj0ux
  weekdayDays: [1, 2, 3, 4, 5],
=======
>>>>>>> main
  weekendTitle: 'Выходные дни',
  weekendFrom: '',
  weekendTo: '',
  weekendTimeFrom: '10:00',
  weekendTimeTo: '18:00',
<<<<<<< codex/implement-schedule-management-for-zone24-cpj0ux
  weekendDays: [6, 7],
=======
>>>>>>> main
  sameAsWeekdays: false,
  recurrence: 'yearly'
};

export const SPECIAL_FORM_TEMPLATE = {
  title: 'Специальное расписание',
  dateFrom: '',
  dateTo: '',
  timeFrom: '09:00',
  timeTo: '18:00',
  recurrence: 'none'
};

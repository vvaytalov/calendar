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

export const BASE_FORM_TEMPLATE = {
  weekdayTitle: 'Будние дни',
  weekdayFrom: '',
  weekdayTo: '',
  weekdayTimeFrom: '08:00',
  weekdayTimeTo: '20:00',
  weekendTitle: 'Выходные дни',
  weekendFrom: '',
  weekendTo: '',
  weekendTimeFrom: '10:00',
  weekendTimeTo: '18:00',
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

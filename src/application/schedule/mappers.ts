import { DAY_LABEL } from '../../shared/calendarConstants';
import { formatDate } from '../../shared/dateFormat';
import type {
  BaseFormState,
  BaseCard,
  SpecialCard,
  SpecialFormState
} from './types';
import type {
  BaseSchedule,
  BaseSchedulePayload,
  SpecialSchedule,
  SpecialSchedulePayload
} from '../../domain/schedule/types';

export const toBaseCards = (items: BaseSchedule[]): BaseCard[] =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    dateLabel: `${formatDate(item.validFrom)} — ${formatDate(item.validTo)}`,
    timeLabel: `${item.timeFrom} - ${item.timeTo}`,
    days: item.daysOfWeek.map((day) => DAY_LABEL[day])
  }));

export const toSpecialCards = (items: SpecialSchedule[]): SpecialCard[] =>
  items.map((item) => {
    const from = new Date(item.dateFrom);
    const to = new Date(item.dateTo);
    const days = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / 86400000) + 1);

    return {
      id: item.id,
      title: item.title,
      dateLabel: `${formatDate(item.dateFrom)} — ${formatDate(item.dateTo)}`,
      daysLabel: `${days} дн.`,
      timeLabel: `${from.toISOString().slice(11, 16)} - ${to.toISOString().slice(11, 16)}`,
      reasonLabel: `Причина: ${item.reason || 'Ручная настройка'}`
    };
  });

export const buildBasePayloads = (form: BaseFormState): {
  weekday: BaseSchedulePayload;
  weekend: BaseSchedulePayload;
} => {
  const weekday: BaseSchedulePayload = {
    title: form.weekdayTitle,
    timeFrom: form.weekdayTimeFrom,
    timeTo: form.weekdayTimeTo,
    daysOfWeek: form.weekdayDays,
    validFrom: form.weekdayFrom,
    validTo: form.weekdayTo
  };

  const weekend: BaseSchedulePayload = {
    title: form.weekendTitle,
    timeFrom: form.sameAsWeekdays ? form.weekdayTimeFrom : form.weekendTimeFrom,
    timeTo: form.sameAsWeekdays ? form.weekdayTimeTo : form.weekendTimeTo,
    daysOfWeek: form.weekendDays,
    validFrom: form.sameAsWeekdays ? form.weekdayFrom : form.weekendFrom || form.weekdayFrom,
    validTo: form.sameAsWeekdays ? form.weekdayTo : form.weekendTo || form.weekdayTo
  };

  return { weekday, weekend };
};

export const buildSpecialPayload = (form: SpecialFormState): SpecialSchedulePayload => ({
  title: form.title,
  dateFrom: new Date(`${form.dateFrom}T${form.timeFrom}:00`).toISOString(),
  dateTo: new Date(`${form.dateTo}T${form.timeTo}:00`).toISOString(),
  priority: 100,
  reason: 'Ручная настройка',
  isOverrideBase: true
});

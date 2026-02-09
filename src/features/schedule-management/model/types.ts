import type { DayNumber, ScheduleKind } from '../../../entities/schedule/model/types';

export type ScheduleMode = 'create' | 'edit';

export interface BaseFormState {
  scheduleType: ScheduleKind;
  dateFrom: string;
  dateTo: string;
  weekdayTimeFrom: string;
  weekdayTimeTo: string;
  weekdayDays: DayNumber[];
  weekendTimeFrom: string;
  weekendTimeTo: string;
  weekendDays: DayNumber[];
  sameAsWeekdays: boolean;
}

export interface SpecialFormState {
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
}

export interface EditingState {
  kind: ScheduleKind;
  id: string;
  ids?: string[];
}

export interface ConfirmState {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  details?: {
    base: string[];
    special: string[];
  };
  reasonLabel?: string;
  reasonPlaceholder?: string;
  onConfirm: ((reason?: string) => void | Promise<void>) | null;
}

export interface BaseCard {
  id: string;
  ids: string[];
  kind: 'weekday' | 'weekend' | 'date';
  timeLabel: string;
  daysLabel: string;
}

export interface SpecialCard {
  id: string;
  ids: string[];
  dateLabel: string;
  timeLabel: string;
}

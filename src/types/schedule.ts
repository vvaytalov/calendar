export type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ScheduleKind = 'base' | 'special';
export type ScheduleMode = 'create' | 'edit';
export type Recurrence = 'yearly' | 'none';

export interface BaseSchedule {
  id: string;
  title: string;
  timeFrom: string;
  timeTo: string;
  daysOfWeek: DayNumber[];
  validFrom: string;
  validTo: string | null;
  zoneId?: string;
  isActive?: boolean;
}

export interface SpecialSchedule {
  id: string;
  title: string;
  dateFrom: string;
  dateTo: string;
  priority: number;
  reason?: string;
  isOverrideBase: boolean;
  zoneId?: string;
}

export interface ScheduleResponse {
  base: BaseSchedule[];
  special: SpecialSchedule[];
}

export interface BaseFormState {
  scheduleType: ScheduleKind;
  weekdayTitle: string;
  weekdayFrom: string;
  weekdayTo: string;
  weekdayTimeFrom: string;
  weekdayTimeTo: string;
  weekdayDays: DayNumber[];
  weekendTitle: string;
  weekendFrom: string;
  weekendTo: string;
  weekendTimeFrom: string;
  weekendTimeTo: string;
  weekendDays: DayNumber[];
  sameAsWeekdays: boolean;
  recurrence: Recurrence;
}

export interface SpecialFormState {
  title: string;
  dateFrom: string;
  dateTo: string;
  timeFrom: string;
  timeTo: string;
  recurrence: Recurrence;
}

export interface EditingState {
  kind: ScheduleKind;
  id: string;
}

export interface ConfirmState {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: (() => void | Promise<void>) | null;
}

export interface BaseCard {
  id: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  days: string[];
}

export interface SpecialCard {
  id: string;
  title: string;
  dateLabel: string;
  daysLabel: string;
  timeLabel: string;
  reasonLabel: string;
}

export interface BaseEditorForm {
  title: string;
  timeFrom: string;
  timeTo: string;
  daysOfWeek: DayNumber[];
  validFrom: string;
  validTo: string | null;
}

export interface SpecialEditorForm {
  title: string;
  dateFrom: string;
  dateTo: string;
  priority: number;
  reason: string;
  isOverrideBase: boolean;
}

export type ScheduleEditorForm = BaseEditorForm | SpecialEditorForm;

export type BaseSchedulePayload = Pick<
  BaseSchedule,
  'title' | 'timeFrom' | 'timeTo' | 'daysOfWeek' | 'validFrom' | 'validTo'
>;

export type SpecialSchedulePayload = Pick<
  SpecialSchedule,
  'title' | 'dateFrom' | 'dateTo' | 'priority' | 'reason' | 'isOverrideBase'
>;

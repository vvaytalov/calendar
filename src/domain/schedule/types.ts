export type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ScheduleKind = 'base' | 'special';

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

export type BaseSchedulePayload = Pick<
  BaseSchedule,
  'title' | 'timeFrom' | 'timeTo' | 'daysOfWeek' | 'validFrom' | 'validTo'
>;

export type SpecialSchedulePayload = Pick<
  SpecialSchedule,
  'title' | 'dateFrom' | 'dateTo' | 'priority' | 'reason' | 'isOverrideBase'
>;

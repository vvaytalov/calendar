export type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type ScheduleKind = 'base' | 'special';

export interface TimeTableEntryApi {
  day?: string;
  date?: string;
  openTime?: string;
  closeTime?: string;
}

export interface TimeTableZoneApi {
  id: string;
  workTime?: TimeTableEntryApi[];
  specialTime?: TimeTableEntryApi[];
}

export type TimeTableZonesResponse = TimeTableZoneApi[];
export type TimeTableZonesPayload = TimeTableZoneApi[];

export interface TimeTableEntry {
  id: string;
  day?: DayNumber | null;
  date?: string | null;
  openTime: string;
  closeTime: string;
}

export interface TimeTableZone {
  id: string;
  workTime: TimeTableEntry[];
  specialTime: TimeTableEntry[];
}

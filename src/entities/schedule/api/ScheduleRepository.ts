import type { TimeTableZonesPayload, TimeTableZonesResponse } from '../model/types';

export interface ScheduleRepository {
  getZoneTimeTable(zoneId: string): Promise<TimeTableZonesResponse>;
  saveZoneTimeTable(payload: TimeTableZonesPayload): Promise<TimeTableZonesResponse>;
}

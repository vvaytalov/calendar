import { API_BASE_URL } from '../../../shared/config/api';
import { requestJson } from '../../../shared/api/httpClient';
import type { ScheduleRepository } from './ScheduleRepository';
import type { TimeTableZonesPayload, TimeTableZonesResponse } from '../model/types';

export class HttpScheduleRepository implements ScheduleRepository {
  getZoneTimeTable(zoneId: string): Promise<TimeTableZonesResponse> {
    return requestJson(`${API_BASE_URL}/zones/${zoneId}`);
  }

  saveZoneTimeTable(payload: TimeTableZonesPayload): Promise<TimeTableZonesResponse> {
    return requestJson(`${API_BASE_URL}/zones`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
}

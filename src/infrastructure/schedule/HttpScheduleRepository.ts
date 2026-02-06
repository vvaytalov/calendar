import { API_BASE_URL } from '../config';
import { requestJson } from '../http/httpClient';
import type { ScheduleRepository } from '../../application/schedule/ScheduleRepository';
import type {
  BaseSchedule,
  BaseSchedulePayload,
  ScheduleResponse,
  SpecialSchedule,
  SpecialSchedulePayload
} from '../../domain/schedule/types';

export class HttpScheduleRepository implements ScheduleRepository {
  getSchedules(zoneCode: string): Promise<ScheduleResponse> {
    return requestJson(`${API_BASE_URL}/${zoneCode}/schedules`);
  }

  createBase(zoneCode: string, payload: BaseSchedulePayload): Promise<BaseSchedule> {
    return requestJson(`${API_BASE_URL}/${zoneCode}/base-schedules`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  updateBase(zoneCode: string, id: string, payload: BaseSchedulePayload): Promise<BaseSchedule> {
    return requestJson(`${API_BASE_URL}/${zoneCode}/base-schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  deleteBase(zoneCode: string, id: string): Promise<void> {
    return requestJson(`${API_BASE_URL}/${zoneCode}/base-schedules/${id}`, {
      method: 'DELETE'
    });
  }

  createSpecial(zoneCode: string, payload: SpecialSchedulePayload): Promise<SpecialSchedule> {
    return requestJson(`${API_BASE_URL}/${zoneCode}/special-schedules`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  updateSpecial(
    zoneCode: string,
    id: string,
    payload: SpecialSchedulePayload
  ): Promise<SpecialSchedule> {
    return requestJson(`${API_BASE_URL}/${zoneCode}/special-schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  deleteSpecial(zoneCode: string, id: string): Promise<void> {
    return requestJson(`${API_BASE_URL}/${zoneCode}/special-schedules/${id}`, {
      method: 'DELETE'
    });
  }

  clearAll(zoneCode: string): Promise<void> {
    return requestJson(`${API_BASE_URL}/${zoneCode}/schedules`, {
      method: 'DELETE'
    });
  }
}

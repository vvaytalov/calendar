import type {
  BaseSchedule,
  BaseSchedulePayload,
  ScheduleResponse,
  SpecialSchedule,
  SpecialSchedulePayload
} from '../types/schedule';

const API = 'http://localhost:4000/api/zones';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Ошибка запроса');
  }

  if (response.status === 204) return null as T;
  return response.json() as Promise<T>;
}

export class ScheduleService {
  getSchedules(zoneCode: string): Promise<ScheduleResponse> {
    return request(`${API}/${zoneCode}/schedules`);
  }

  createBase(zoneCode: string, payload: BaseSchedulePayload): Promise<BaseSchedule> {
    return request(`${API}/${zoneCode}/base-schedules`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  updateBase(zoneCode: string, id: string, payload: BaseSchedulePayload): Promise<BaseSchedule> {
    return request(`${API}/${zoneCode}/base-schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  deleteBase(zoneCode: string, id: string): Promise<void> {
    return request(`${API}/${zoneCode}/base-schedules/${id}`, {
      method: 'DELETE'
    });
  }

  createSpecial(zoneCode: string, payload: SpecialSchedulePayload): Promise<SpecialSchedule> {
    return request(`${API}/${zoneCode}/special-schedules`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  updateSpecial(
    zoneCode: string,
    id: string,
    payload: SpecialSchedulePayload
  ): Promise<SpecialSchedule> {
    return request(`${API}/${zoneCode}/special-schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  deleteSpecial(zoneCode: string, id: string): Promise<void> {
    return request(`${API}/${zoneCode}/special-schedules/${id}`, {
      method: 'DELETE'
    });
  }

  clearAll(zoneCode: string): Promise<void> {
    return request(`${API}/${zoneCode}/schedules`, {
      method: 'DELETE'
    });
  }
}

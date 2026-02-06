const API = 'http://localhost:4000/api/zones';

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Ошибка запроса');
  }

  if (response.status === 204) return null;
  return response.json();
}

export class ScheduleService {
  getSchedules(zoneCode) {
    return request(`${API}/${zoneCode}/schedules`);
  }

  createBase(zoneCode, payload) {
    return request(`${API}/${zoneCode}/base-schedules`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  updateBase(zoneCode, id, payload) {
    return request(`${API}/${zoneCode}/base-schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  deleteBase(zoneCode, id) {
    return request(`${API}/${zoneCode}/base-schedules/${id}`, {
      method: 'DELETE'
    });
  }

  createSpecial(zoneCode, payload) {
    return request(`${API}/${zoneCode}/special-schedules`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  updateSpecial(zoneCode, id, payload) {
    return request(`${API}/${zoneCode}/special-schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  }

  deleteSpecial(zoneCode, id) {
    return request(`${API}/${zoneCode}/special-schedules/${id}`, {
      method: 'DELETE'
    });
  }

  clearAll(zoneCode) {
    return request(`${API}/${zoneCode}/schedules`, {
      method: 'DELETE'
    });
  }
}

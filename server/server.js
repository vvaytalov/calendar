import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const zoneCode = 'zone24';

let baseSchedules = [];
let specialSchedules = [];

const makeId = (prefix) => `${prefix}${Math.random().toString(36).slice(2, 9)}`;

const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && bStart < aEnd;

const validateBase = (payload) => {
  if (!payload.title?.trim()) return 'Название обязательно';
  if (!payload.timeFrom || !payload.timeTo) return 'Укажите время начала и окончания';
  if (payload.timeFrom >= payload.timeTo) return 'timeFrom должен быть меньше timeTo';
  if (!Array.isArray(payload.daysOfWeek) || payload.daysOfWeek.length === 0) return 'Выберите дни недели';
  return null;
};

const validateSpecial = (payload, currentId = null) => {
  if (!payload.title?.trim()) return 'Название обязательно';
  const dateFrom = new Date(payload.dateFrom);
  const dateTo = new Date(payload.dateTo);

  if (Number.isNaN(dateFrom.getTime()) || Number.isNaN(dateTo.getTime())) return 'Неверные даты';
  if (dateFrom >= dateTo) return 'dateFrom должен быть меньше dateTo';

  const hasConflict = specialSchedules.some((item) => {
    if (item.id === currentId) return false;
    if (!item.isOverrideBase || !payload.isOverrideBase) return false;
    if (item.priority !== Number(payload.priority)) return false;

    return overlaps(dateFrom, dateTo, new Date(item.dateFrom), new Date(item.dateTo));
  });

  if (hasConflict) return 'Конфликт: пересечение специальных интервалов с одинаковым приоритетом';
  return null;
};

app.get('/api/zones/:zone/schedules', (req, res) => {
  if (req.params.zone !== zoneCode) return res.status(404).json({ message: 'Zone not found' });
  res.json({ base: baseSchedules, special: specialSchedules });
});

app.delete('/api/zones/:zone/schedules', (req, res) => {
  if (req.params.zone !== zoneCode) return res.status(404).json({ message: 'Zone not found' });
  baseSchedules = [];
  specialSchedules = [];
  res.status(204).send();
});

app.post('/api/zones/:zone/base-schedules', (req, res) => {
  if (req.params.zone !== zoneCode) return res.status(404).json({ message: 'Zone not found' });
  const validationError = validateBase(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  const created = { ...req.body, id: makeId('b'), zoneId: zoneCode, isActive: true };
  baseSchedules.push(created);
  res.status(201).json(created);
});

app.put('/api/zones/:zone/base-schedules/:id', (req, res) => {
  const idx = baseSchedules.findIndex((item) => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Запись не найдена' });
  const validationError = validateBase(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  baseSchedules[idx] = { ...baseSchedules[idx], ...req.body };
  res.json(baseSchedules[idx]);
});

app.delete('/api/zones/:zone/base-schedules/:id', (req, res) => {
  const before = baseSchedules.length;
  baseSchedules = baseSchedules.filter((item) => item.id !== req.params.id);
  if (baseSchedules.length === before) return res.status(404).json({ message: 'Запись не найдена' });
  res.status(204).send();
});

app.post('/api/zones/:zone/special-schedules', (req, res) => {
  const validationError = validateSpecial(req.body);
  if (validationError) return res.status(400).json({ message: validationError });

  const created = {
    ...req.body,
    id: makeId('s'),
    zoneId: zoneCode,
    priority: Number(req.body.priority)
  };
  specialSchedules.push(created);
  res.status(201).json(created);
});

app.put('/api/zones/:zone/special-schedules/:id', (req, res) => {
  const idx = specialSchedules.findIndex((item) => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Запись не найдена' });

  const validationError = validateSpecial(req.body, req.params.id);
  if (validationError) return res.status(400).json({ message: validationError });

  specialSchedules[idx] = {
    ...specialSchedules[idx],
    ...req.body,
    priority: Number(req.body.priority)
  };
  res.json(specialSchedules[idx]);
});

app.delete('/api/zones/:zone/special-schedules/:id', (req, res) => {
  const before = specialSchedules.length;
  specialSchedules = specialSchedules.filter((item) => item.id !== req.params.id);
  if (specialSchedules.length === before) return res.status(404).json({ message: 'Запись не найдена' });
  res.status(204).send();
});

const port = 4000;
app.listen(port, () => {
  console.log(`API started on http://localhost:${port}`);
});

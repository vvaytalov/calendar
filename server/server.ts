import express from 'express';
import cors from 'cors';

interface BaseSchedulePayload {
  title: string;
  timeFrom: string;
  timeTo: string;
  daysOfWeek: number[];
  validFrom: string;
  validTo: string | null;
}

interface BaseSchedule extends BaseSchedulePayload {
  id: string;
  zoneId: string;
  isActive: boolean;
}

interface SpecialSchedulePayload {
  title: string;
  dateFrom: string;
  dateTo: string;
  priority: number;
  reason?: string;
  isOverrideBase: boolean;
}

interface SpecialSchedule extends SpecialSchedulePayload {
  id: string;
  zoneId: string;
}

const app = express();
app.use(cors());
app.use(express.json());

const zoneCode = 'zone24';

let baseSchedules: BaseSchedule[] = [];
let specialSchedules: SpecialSchedule[] = [];

const makeId = (prefix: string) => `${prefix}${Math.random().toString(36).slice(2, 9)}`;

const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) => aStart < bEnd && bStart < aEnd;

const validateBase = (payload: BaseSchedulePayload) => {
  if (!payload.title?.trim()) return 'Название обяза�,ел�Oно';
  if (!payload.timeFrom || !payload.timeTo) return 'Укажи�,е в�?емя на�?ала и окон�?ания';
  if (payload.timeFrom >= payload.timeTo) return 'timeFrom должен б�<�,�O мен�O�^е timeTo';
  if (!Array.isArray(payload.daysOfWeek) || payload.daysOfWeek.length === 0)
    return '�'�<бе�?и�,е дни недели';
  return null;
};

const validateSpecial = (payload: SpecialSchedulePayload, currentId: string | null = null) => {
  if (!payload.title?.trim()) return 'Название обяза�,ел�Oно';
  const dateFrom = new Date(payload.dateFrom);
  const dateTo = new Date(payload.dateTo);

  if (Number.isNaN(dateFrom.getTime()) || Number.isNaN(dateTo.getTime())) return 'Неве�?н�<е да�,�<';
  if (dateFrom >= dateTo) return 'dateFrom должен б�<�,�O мен�O�^е dateTo';

  const hasConflict = specialSchedules.some((item) => {
    if (item.id === currentId) return false;
    if (!item.isOverrideBase || !payload.isOverrideBase) return false;
    if (item.priority !== Number(payload.priority)) return false;

    return overlaps(dateFrom, dateTo, new Date(item.dateFrom), new Date(item.dateTo));
  });

  if (hasConflict)
    return '�sон�"лик�,: пе�?есе�?ение спе�?иал�Oн�<�. ин�,е�?валов с одинаков�<м п�?ио�?и�,е�,ом';
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
  const payload = req.body as BaseSchedulePayload;
  const validationError = validateBase(payload);
  if (validationError) return res.status(400).json({ message: validationError });

  const created: BaseSchedule = { ...payload, id: makeId('b'), zoneId: zoneCode, isActive: true };
  baseSchedules.push(created);
  res.status(201).json(created);
});

app.put('/api/zones/:zone/base-schedules/:id', (req, res) => {
  const idx = baseSchedules.findIndex((item) => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: '�-апис�O не найдена' });
  const payload = req.body as BaseSchedulePayload;
  const validationError = validateBase(payload);
  if (validationError) return res.status(400).json({ message: validationError });

  baseSchedules[idx] = { ...baseSchedules[idx], ...payload };
  res.json(baseSchedules[idx]);
});

app.delete('/api/zones/:zone/base-schedules/:id', (req, res) => {
  const before = baseSchedules.length;
  baseSchedules = baseSchedules.filter((item) => item.id !== req.params.id);
  if (baseSchedules.length === before)
    return res.status(404).json({ message: '�-апис�O не найдена' });
  res.status(204).send();
});

app.post('/api/zones/:zone/special-schedules', (req, res) => {
  const payload = req.body as SpecialSchedulePayload;
  const validationError = validateSpecial(payload);
  if (validationError) return res.status(400).json({ message: validationError });

  const created: SpecialSchedule = {
    ...payload,
    id: makeId('s'),
    zoneId: zoneCode,
    priority: Number(payload.priority)
  };
  specialSchedules.push(created);
  res.status(201).json(created);
});

app.put('/api/zones/:zone/special-schedules/:id', (req, res) => {
  const idx = specialSchedules.findIndex((item) => item.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: '�-апис�O не найдена' });

  const payload = req.body as SpecialSchedulePayload;
  const validationError = validateSpecial(payload, req.params.id);
  if (validationError) return res.status(400).json({ message: validationError });

  specialSchedules[idx] = {
    ...specialSchedules[idx],
    ...payload,
    priority: Number(payload.priority)
  };
  res.json(specialSchedules[idx]);
});

app.delete('/api/zones/:zone/special-schedules/:id', (req, res) => {
  const before = specialSchedules.length;
  specialSchedules = specialSchedules.filter((item) => item.id !== req.params.id);
  if (specialSchedules.length === before)
    return res.status(404).json({ message: '�-апис�O не найдена' });
  res.status(204).send();
});

const port = 4000;
app.listen(port, () => {
  console.log(`API started on http://localhost:${port}`);
});

import express from 'express';
import cors from 'cors';

interface TimeTableEntry {
  day?: string;
  date?: string;
  openTime?: string;
  closeTime?: string;
}

interface TimeTableZone {
  id: string;
  workTime: TimeTableEntry[];
  specialTime: TimeTableEntry[];
}

const app = express();
app.use(cors());
app.use(express.json());

let zones: TimeTableZone[] = [
  {
    id: 'zone24',
    workTime: [],
    specialTime: []
  }
];

app.get('/time-tables/zones/:id', (req, res) => {
  const zone = zones.find((item) => item.id === req.params.id);
  if (!zone) return res.json([]);
  res.json([zone]);
});

app.post('/time-tables/zones', (req, res) => {
  const payload = req.body as TimeTableZone[];
  if (!Array.isArray(payload)) return res.status(400).json({ message: 'Invalid payload' });
  zones = payload.map((item) => ({
    id: item.id,
    workTime: item.workTime || [],
    specialTime: item.specialTime || []
  }));
  res.json(zones);
});

const port = 4000;
app.listen(port, () => {
  console.log(`API started on http://localhost:${port}`);
});

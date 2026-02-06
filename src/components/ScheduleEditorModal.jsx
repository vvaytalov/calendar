import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography
} from '@mui/material';

const defaultBase = {
  title: '',
  timeFrom: '08:00',
  timeTo: '20:00',
  daysOfWeek: [1, 2, 3, 4, 5],
  validFrom: new Date().toISOString().slice(0, 10),
  validTo: null
};

const defaultSpecial = {
  title: '',
  dateFrom: new Date().toISOString().slice(0, 16),
  dateTo: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
  priority: 100,
  reason: '',
  isOverrideBase: true
};

const dayOptions = [
  [1, 'Пн'],
  [2, 'Вт'],
  [3, 'Ср'],
  [4, 'Чт'],
  [5, 'Пт'],
  [6, 'Сб'],
  [7, 'Вс']
];

export function ScheduleEditorModal({ open, mode, kind, initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(kind === 'base' ? defaultBase : defaultSpecial);

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      if (kind === 'special') {
        setForm({
          ...initialData,
          dateFrom: initialData.dateFrom.slice(0, 16),
          dateTo: initialData.dateTo.slice(0, 16)
        });
      } else {
        setForm(initialData);
      }
      return;
    }

    setForm(kind === 'base' ? defaultBase : defaultSpecial);
  }, [open, kind, initialData]);

  const title = `${mode === 'create' ? 'Добавление' : 'Редактирование'} ${
    kind === 'base' ? 'основного' : 'специального'
  } расписания`;

  const submit = (e) => {
    e.preventDefault();
    const payload =
      kind === 'special'
        ? {
            ...form,
            dateFrom: new Date(form.dateFrom).toISOString(),
            dateTo: new Date(form.dateTo).toISOString()
          }
        : form;

    onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={submit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Название"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              fullWidth
            />

            {kind === 'base' ? (
              <>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Время начала"
                    type="time"
                    value={form.timeFrom}
                    onChange={(e) => setForm({ ...form, timeFrom: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Время окончания"
                    type="time"
                    value={form.timeTo}
                    onChange={(e) => setForm({ ...form, timeTo: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                </Stack>

                <Typography variant="body2">Дни недели</Typography>
                <FormGroup row>
                  {dayOptions.map(([num, text]) => (
                    <FormControlLabel
                      key={num}
                      control={
                        <Checkbox
                          checked={form.daysOfWeek.includes(num)}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...form.daysOfWeek, num].sort((a, b) => a - b)
                              : form.daysOfWeek.filter((d) => d !== num);
                            setForm({ ...form, daysOfWeek: next });
                          }}
                        />
                      }
                      label={text}
                    />
                  ))}
                </FormGroup>
              </>
            ) : (
              <>
                <TextField
                  label="Начало периода"
                  type="datetime-local"
                  value={form.dateFrom}
                  onChange={(e) => setForm({ ...form, dateFrom: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <TextField
                  label="Конец периода"
                  type="datetime-local"
                  value={form.dateTo}
                  onChange={(e) => setForm({ ...form, dateTo: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <TextField
                  label="Приоритет"
                  type="number"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: Number(e.target.value) })}
                  required
                  fullWidth
                />
                <TextField
                  label="Причина"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.isOverrideBase}
                      onChange={(e) => setForm({ ...form, isOverrideBase: e.target.checked })}
                    />
                  }
                  label="Перекрыть основное расписание"
                />
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} color="inherit">
            Отмена
          </Button>
          <Button type="submit" variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

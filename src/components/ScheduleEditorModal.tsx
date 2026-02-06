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
import { useEffect, useState, type FormEvent } from 'react';
import type {
  BaseEditorForm,
  ScheduleEditorForm,
  ScheduleMode,
  SpecialEditorForm
} from '../application/schedule/types';
import type { DayNumber, ScheduleKind } from '../domain/schedule/types';
import { DAY_OPTIONS } from '../shared/calendarConstants';

const defaultBase: BaseEditorForm = {
  title: '',
  timeFrom: '08:00',
  timeTo: '20:00',
  daysOfWeek: [1, 2, 3, 4, 5],
  validFrom: new Date().toISOString().slice(0, 10),
  validTo: null
};

const defaultSpecial: SpecialEditorForm = {
  title: '',
  dateFrom: new Date().toISOString().slice(0, 16),
  dateTo: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
  priority: 100,
  reason: '',
  isOverrideBase: true
};

const dayOptions: Array<[DayNumber, string]> = DAY_OPTIONS.map((item) => [
  item.value,
  item.label
]);

interface ScheduleEditorModalProps {
  open: boolean;
  mode: ScheduleMode;
  kind: ScheduleKind;
  initialData?: ScheduleEditorForm | null;
  onClose: () => void;
  onSubmit: (payload: ScheduleEditorForm) => void;
}

export function ScheduleEditorModal({
  open,
  mode,
  kind,
  initialData,
  onClose,
  onSubmit
}: ScheduleEditorModalProps) {
  const [form, setForm] = useState<ScheduleEditorForm>(
    kind === 'base' ? defaultBase : defaultSpecial
  );

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      if (kind === 'special') {
        const data = initialData as SpecialEditorForm;
        setForm({
          ...data,
          dateFrom: data.dateFrom.slice(0, 16),
          dateTo: data.dateTo.slice(0, 16)
        });
      } else {
        setForm(initialData as BaseEditorForm);
      }
      return;
    }

    setForm(kind === 'base' ? defaultBase : defaultSpecial);
  }, [open, kind, initialData]);

  const title = `${mode === 'create' ? 'Добавление' : 'Редактирование'} ${
    kind === 'base' ? 'основного' : 'специального'
  } расписания`;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload =
      kind === 'special'
        ? {
            ...(form as SpecialEditorForm),
            dateFrom: new Date((form as SpecialEditorForm).dateFrom).toISOString(),
            dateTo: new Date((form as SpecialEditorForm).dateTo).toISOString()
          }
        : (form as BaseEditorForm);

    onSubmit(payload);
  };

  const baseForm = form as BaseEditorForm;
  const specialForm = form as SpecialEditorForm;

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
                    value={baseForm.timeFrom}
                    onChange={(e) => setForm({ ...baseForm, timeFrom: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Время окончания"
                    type="time"
                    value={baseForm.timeTo}
                    onChange={(e) => setForm({ ...baseForm, timeTo: e.target.value })}
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
                          checked={baseForm.daysOfWeek.includes(num)}
                          onChange={(e) => {
                            const next = e.target.checked
                              ? [...baseForm.daysOfWeek, num].sort((a, b) => a - b)
                              : baseForm.daysOfWeek.filter((d) => d !== num);
                            setForm({ ...baseForm, daysOfWeek: next });
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
                  value={specialForm.dateFrom}
                  onChange={(e) => setForm({ ...specialForm, dateFrom: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <TextField
                  label="Конец периода"
                  type="datetime-local"
                  value={specialForm.dateTo}
                  onChange={(e) => setForm({ ...specialForm, dateTo: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <TextField
                  label="Приоритет"
                  type="number"
                  value={specialForm.priority}
                  onChange={(e) => setForm({ ...specialForm, priority: Number(e.target.value) })}
                  required
                  fullWidth
                />
                <TextField
                  label="Причина"
                  value={specialForm.reason}
                  onChange={(e) => setForm({ ...specialForm, reason: e.target.value })}
                  fullWidth
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={specialForm.isOverrideBase}
                      onChange={(e) =>
                        setForm({ ...specialForm, isOverrideBase: e.target.checked })
                      }
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

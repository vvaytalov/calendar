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
import type { ScheduleMode } from '../../schedule-management/model/types';
import type { DayNumber, ScheduleKind } from '../../../entities/schedule/model/types';
import { DAY_OPTIONS } from '../../../shared/config/calendarConstants';

interface WorkEditorForm {
  openTime: string;
  closeTime: string;
  daysOfWeek: DayNumber[];
}

interface SpecialEditorForm {
  date: string;
  openTime: string;
  closeTime: string;
}

type ScheduleEditorForm = WorkEditorForm | SpecialEditorForm;

const defaultBase: WorkEditorForm = {
  openTime: '08:00',
  closeTime: '20:00',
  daysOfWeek: [1, 2, 3, 4, 5]
};

const defaultSpecial: SpecialEditorForm = {
  date: new Date().toISOString().slice(0, 10),
  openTime: '09:00',
  closeTime: '18:00'
};

const dayOptions: Array<[DayNumber, string]> = DAY_OPTIONS.map((item) => [item.value, item.label]);

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
      setForm(initialData);
      return;
    }

    setForm(kind === 'base' ? defaultBase : defaultSpecial);
  }, [open, kind, initialData]);

  const title = `${mode === 'create' ? 'Создать' : 'Редактировать'} ${
    kind === 'base' ? 'рабочее' : 'специальное'
  } расписание`;

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  const baseForm = form as WorkEditorForm;
  const specialForm = form as SpecialEditorForm;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={submit}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {kind === 'base' ? (
              <>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Время начала"
                    type="time"
                    value={baseForm.openTime}
                    onChange={(e) => setForm({ ...baseForm, openTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    required
                  />
                  <TextField
                    label="Время окончания"
                    type="time"
                    value={baseForm.closeTime}
                    onChange={(e) => setForm({ ...baseForm, closeTime: e.target.value })}
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
                  label="Дата"
                  type="date"
                  value={specialForm.date}
                  onChange={(e) => setForm({ ...specialForm, date: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Время начала"
                    type="time"
                    value={specialForm.openTime}
                    onChange={(e) => setForm({ ...specialForm, openTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Время окончания"
                    type="time"
                    value={specialForm.closeTime}
                    onChange={(e) => setForm({ ...specialForm, closeTime: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    required
                    fullWidth
                  />
                </Stack>
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

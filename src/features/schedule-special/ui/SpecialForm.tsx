import { FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField } from '@mui/material';
import { panelSx } from '../../../shared/ui/schedulePanelStyles';
import { scheduleFieldSx } from '../../../shared/ui/scheduleFieldSx';
import {
  DateRangeFields,
  FieldLabel,
  FormActions,
  FormTitle,
  TimeRangeFields
} from '../../../shared/ui/scheduleFormParts';
import type { SpecialFormState } from '../../schedule-management/model/types';
import type { ScheduleKind } from '../../../entities/schedule/model/types';

interface SpecialFormProps {
  specialForm: SpecialFormState;
  editingKind?: ScheduleKind;
  onChange: (patch: Partial<SpecialFormState>) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function SpecialForm({
  specialForm,
  editingKind,
  onChange,
  onCancel,
  onSave
}: SpecialFormProps) {
  const canSave = Boolean(specialForm.dateFrom && specialForm.dateTo);

  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={1.25}>
        <FormTitle>
          {editingKind === 'special' ? 'Редактирование' : 'Создание'} специального расписания
        </FormTitle>
        <TextField
          label="Заголовок"
          size="small"
          value={specialForm.title}
          onChange={(e) => onChange({ title: e.target.value })}
          sx={scheduleFieldSx}
        />

        <Stack spacing={0.5}>
          <FieldLabel>День</FieldLabel>
          <DateRangeFields
            fromLabel="Начало"
            toLabel="Окончание"
            fromValue={specialForm.dateFrom}
            toValue={specialForm.dateTo}
            onChangeFrom={(value) => onChange({ dateFrom: value })}
            onChangeTo={(value) => onChange({ dateTo: value })}
            fieldSx={scheduleFieldSx}
          />
        </Stack>

        <Stack spacing={0.5}>
          <FieldLabel>Часы</FieldLabel>
          <TimeRangeFields
            fromLabel="Время (начало)"
            toLabel="Время (окончание)"
            fromValue={specialForm.timeFrom}
            toValue={specialForm.timeTo}
            onChangeFrom={(value) => onChange({ timeFrom: value })}
            onChangeTo={(value) => onChange({ timeTo: value })}
            fieldSx={scheduleFieldSx}
          />
        </Stack>

        <FormControl size="small" sx={scheduleFieldSx} fullWidth>
          <InputLabel>Повторяемость</InputLabel>
          <Select
            value={specialForm.recurrence}
            label="Повторяемость"
            onChange={(e) =>
              onChange({ recurrence: e.target.value as SpecialFormState['recurrence'] })
            }
          >
            <MenuItem value="none">Отсутствует</MenuItem>
            <MenuItem value="yearly">Каждый год</MenuItem>
          </Select>
        </FormControl>

        <FormActions onCancel={onCancel} onSave={onSave} disableSave={!canSave} />
      </Stack>
    </Paper>
  );
}

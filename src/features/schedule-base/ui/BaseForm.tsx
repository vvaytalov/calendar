import {
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack
} from '@mui/material';
import { DaysSelector } from './DaysSelector';
import { panelSx } from '../../../shared/ui/schedulePanelStyles';
import { scheduleFieldSx } from '../../../shared/ui/scheduleFieldSx';
import {
  DateRangeFields,
  FieldLabel,
  FormActions,
  FormTitle,
  TimeRangeFields
} from '../../../shared/ui/scheduleFormParts';
import type { BaseFormState } from '../../schedule-management/model/types';
import type { DayNumber } from '../../../entities/schedule/model/types';

interface BaseFormProps {
  baseForm: BaseFormState;
  onChange: (patch: Partial<BaseFormState>) => void;
  onToggleWeekday: (day: DayNumber) => void;
  onToggleWeekend: (day: DayNumber) => void;
  onCancel: () => void;
  onSave: () => void;
}

export function BaseForm({
  baseForm,
  onChange,
  onToggleWeekday,
  onToggleWeekend,
  onCancel,
  onSave
}: BaseFormProps) {
  const hasWeekdayDates = Boolean(baseForm.weekdayFrom && baseForm.weekdayTo);
  const hasWeekdayDays = baseForm.weekdayDays.length > 0;
  const hasWeekendDates = Boolean(baseForm.weekendFrom && baseForm.weekendTo);
  const hasWeekendDays = baseForm.weekendDays.length > 0;
  const canSave = baseForm.sameAsWeekdays
    ? hasWeekdayDates && hasWeekdayDays
    : hasWeekdayDates && hasWeekdayDays && hasWeekendDates && hasWeekendDays;

  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={1.25}>
        <FormTitle>{baseForm.weekdayTitle}</FormTitle>

        <Stack spacing={0.5}>
          <FieldLabel>День</FieldLabel>
          <DateRangeFields
            fromLabel="Начало"
            toLabel="Окончание"
            fromValue={baseForm.weekdayFrom}
            toValue={baseForm.weekdayTo}
            onChangeFrom={(value) => onChange({ weekdayFrom: value })}
            onChangeTo={(value) => onChange({ weekdayTo: value })}
            fieldSx={scheduleFieldSx}
          />
        </Stack>

        <Stack spacing={0.5}>
          <FieldLabel>Часы</FieldLabel>
          <TimeRangeFields
            fromLabel="Время (начало)"
            toLabel="Время (окончание)"
            fromValue={baseForm.weekdayTimeFrom}
            toValue={baseForm.weekdayTimeTo}
            onChangeFrom={(value) => onChange({ weekdayTimeFrom: value })}
            onChangeTo={(value) => onChange({ weekdayTimeTo: value })}
            fieldSx={scheduleFieldSx}
          />
        </Stack>

        <FormControlLabel
          sx={{
            px: 0.75,
            py: 0.35,
            borderRadius: '8px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #EEF2F7',
            '& .MuiFormControlLabel-label': { fontSize: 12, color: '#374151' }
          }}
          control={
            <Checkbox
              size="small"
              checked={baseForm.sameAsWeekdays}
              onChange={(e) => onChange({ sameAsWeekdays: e.target.checked })}
              sx={{ color: '#D1D5DB', '&.Mui-checked': { color: '#22C55E' } }}
            />
          }
          label="Будние и выходные дни совпадают"
        />

        <DaysSelector label="Дни" value={baseForm.weekdayDays} onToggle={onToggleWeekday} />

        <FormControl size="small" sx={scheduleFieldSx} fullWidth>
          <InputLabel>Повторяемость</InputLabel>
          <Select
            value={baseForm.recurrence}
            label="Повторяемость"
            onChange={(e) =>
              onChange({ recurrence: e.target.value as BaseFormState['recurrence'] })
            }
          >
            <MenuItem value="yearly">Каждый год</MenuItem>
            <MenuItem value="none">Отсутствует</MenuItem>
          </Select>
        </FormControl>

        {!baseForm.sameAsWeekdays && (
          <>
            <Divider />
            <FormTitle>{baseForm.weekendTitle}</FormTitle>

            <Stack spacing={0.5}>
              <FieldLabel>Часы</FieldLabel>
              <TimeRangeFields
                fromLabel="Время (начало)"
                toLabel="Время (окончание)"
                fromValue={baseForm.weekendTimeFrom}
                toValue={baseForm.weekendTimeTo}
                onChangeFrom={(value) => onChange({ weekendTimeFrom: value })}
                onChangeTo={(value) => onChange({ weekendTimeTo: value })}
                fieldSx={scheduleFieldSx}
              />
            </Stack>

            <DaysSelector label="Дни" value={baseForm.weekendDays} onToggle={onToggleWeekend} />

            <FormControl size="small" sx={scheduleFieldSx} fullWidth>
              <InputLabel>Повторяемость</InputLabel>
              <Select
                value={baseForm.recurrence}
                label="Повторяемость"
                onChange={(e) =>
                  onChange({ recurrence: e.target.value as BaseFormState['recurrence'] })
                }
              >
                <MenuItem value="yearly">Каждый год</MenuItem>
                <MenuItem value="none">Отсутствует</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        <FormActions onCancel={onCancel} onSave={onSave} disableSave={!canSave} />
      </Stack>
    </Paper>
  );
}

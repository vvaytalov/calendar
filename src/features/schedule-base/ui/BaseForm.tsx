import { Checkbox, Divider, FormControlLabel, Paper, Stack } from '@mui/material';
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
  const hasWeekdayDays = baseForm.weekdayDays.length > 0;
  const hasWeekendDays = baseForm.weekendDays.length > 0;
  const hasWeekdayTime = Boolean(baseForm.weekdayTimeFrom && baseForm.weekdayTimeTo);
  const hasWeekendTime = Boolean(baseForm.weekendTimeFrom && baseForm.weekendTimeTo);
  const canSave = baseForm.sameAsWeekdays
    ? hasWeekdayDays && hasWeekdayTime
    : (hasWeekdayDays && hasWeekdayTime) || (hasWeekendDays && hasWeekendTime);

  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={1.25}>
        <FormTitle>Рабочие дни</FormTitle>

        <Stack spacing={0.5}>
          <FieldLabel>Дата</FieldLabel>
          <DateRangeFields
            fromLabel="Начало"
            toLabel="Окончание"
            fromValue={baseForm.dateFrom}
            toValue={baseForm.dateTo}
            onChangeFrom={(value) => onChange({ dateFrom: value })}
            onChangeTo={(value) => onChange({ dateTo: value })}
            fieldSx={scheduleFieldSx}
          />
        </Stack>

        <Stack spacing={0.5}>
          <FieldLabel>Время</FieldLabel>
          <TimeRangeFields
            fromLabel="Время (начала)"
            toLabel="Время (окончания)"
            fromValue={baseForm.weekdayTimeFrom}
            toValue={baseForm.weekdayTimeTo}
            onChangeFrom={(value) => onChange({ weekdayTimeFrom: value })}
            onChangeTo={(value) => onChange({ weekdayTimeTo: value })}
            fieldSx={scheduleFieldSx}
          />
        </Stack>

        <DaysSelector label="Дни" value={baseForm.weekdayDays} onToggle={onToggleWeekday} />

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
          label="Использовать настройки будней для выходных"
        />

        {!baseForm.sameAsWeekdays && (
          <>
            <Divider />
            <FormTitle>Выходные дни</FormTitle>

            <Stack spacing={0.5}>
              <FieldLabel>Время</FieldLabel>
              <TimeRangeFields
                fromLabel="Время (начала)"
                toLabel="Время (окончания)"
                fromValue={baseForm.weekendTimeFrom}
                toValue={baseForm.weekendTimeTo}
                onChangeFrom={(value) => onChange({ weekendTimeFrom: value })}
                onChangeTo={(value) => onChange({ weekendTimeTo: value })}
                fieldSx={scheduleFieldSx}
              />
            </Stack>

            <DaysSelector label="Дни" value={baseForm.weekendDays} onToggle={onToggleWeekend} />
          </>
        )}

        <FormActions onCancel={onCancel} onSave={onSave} disableSave={!canSave} />
      </Stack>
    </Paper>
  );
}

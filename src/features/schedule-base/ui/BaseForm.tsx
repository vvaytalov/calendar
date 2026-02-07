import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { DaysSelector } from './DaysSelector';
import { panelSx } from '../../../shared/ui/schedulePanelStyles';
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
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#FFFFFF',
      fontSize: 12
    },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
    '& .MuiInputLabel-root': { fontSize: 11, color: '#6B7280' },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#22C55E'
    }
  } as const;

  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={1.25}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
          {baseForm.weekdayTitle}
        </Typography>

        <Stack spacing={0.5}>
          <FormControl size="small" sx={fieldSx} fullWidth>
            <InputLabel>Тип расписания</InputLabel>
            <Select
              value={baseForm.scheduleType}
              label="Тип расписания"
              onChange={(e) =>
                onChange({ scheduleType: e.target.value as BaseFormState['scheduleType'] })
              }
            >
              <MenuItem value="base">Основное расписание</MenuItem>
              <MenuItem value="special">Специальное расписание</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Stack spacing={0.5}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>День</Typography>
          <Stack direction="row" spacing={0.75}>
            <TextField
              label="Начало"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={baseForm.weekdayFrom}
              onChange={(e) => onChange({ weekdayFrom: e.target.value })}
              sx={fieldSx}
              fullWidth
            />
            <TextField
              label="Окончание"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={baseForm.weekdayTo}
              onChange={(e) => onChange({ weekdayTo: e.target.value })}
              sx={fieldSx}
              fullWidth
            />
          </Stack>
        </Stack>

        <Stack spacing={0.5}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Часы</Typography>
          <Stack direction="row" spacing={0.75}>
            <TextField
              label="Время (начало)"
              type="time"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={baseForm.weekdayTimeFrom}
              onChange={(e) => onChange({ weekdayTimeFrom: e.target.value })}
              sx={fieldSx}
              fullWidth
            />
            <TextField
              label="Время (окончание)"
              type="time"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={baseForm.weekdayTimeTo}
              onChange={(e) => onChange({ weekdayTimeTo: e.target.value })}
              sx={fieldSx}
              fullWidth
            />
          </Stack>
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

        <FormControl size="small" sx={fieldSx} fullWidth>
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
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
              {baseForm.weekendTitle}
            </Typography>

            <Stack spacing={0.5}>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Часы</Typography>
              <Stack direction="row" spacing={0.75}>
                <TextField
                  label="Время (начало)"
                  type="time"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={baseForm.weekendTimeFrom}
                  onChange={(e) => onChange({ weekendTimeFrom: e.target.value })}
                  sx={fieldSx}
                  fullWidth
                />
                <TextField
                  label="Время (окончание)"
                  type="time"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={baseForm.weekendTimeTo}
                  onChange={(e) => onChange({ weekendTimeTo: e.target.value })}
                  sx={fieldSx}
                  fullWidth
                />
              </Stack>
            </Stack>

            <DaysSelector label="Дни" value={baseForm.weekendDays} onToggle={onToggleWeekend} />

            <FormControl size="small" sx={fieldSx} fullWidth>
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

        <Stack direction="row" justifyContent="flex-end" spacing={0.75}>
          <Button size="small" variant="text" sx={{ color: '#6B7280' }} onClick={onCancel}>
            Отмена
          </Button>
          <Button
            size="small"
            variant="contained"
            sx={{
              borderRadius: '8px',
              backgroundColor: '#22C55E',
              boxShadow: '0px 6px 12px rgba(34, 197, 94, 0.24)',
              '&:hover': { backgroundColor: '#16A34A' }
            }}
            onClick={onSave}
          >
            Сохранить
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

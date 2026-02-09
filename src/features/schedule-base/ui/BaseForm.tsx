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
  Skeleton,
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
  isLoading?: boolean;
}

export function BaseForm({
  baseForm,
  onChange,
  onToggleWeekday,
  onToggleWeekend,
  onCancel,
  onSave,
  isLoading = false
}: BaseFormProps) {
  const hasWeekdayDates = Boolean(baseForm.weekdayFrom && baseForm.weekdayTo);
  const hasWeekdayDays = baseForm.weekdayDays.length > 0;
  const hasWeekendDates = Boolean(baseForm.weekendFrom && baseForm.weekendTo);
  const hasWeekendDays = baseForm.weekendDays.length > 0;
  const canSave = baseForm.sameAsWeekdays
    ? hasWeekdayDates && hasWeekdayDays
    : hasWeekdayDates && hasWeekdayDays && hasWeekendDates && hasWeekendDays;

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

  if (isLoading) {
    return (
      <Paper elevation={0} sx={panelSx}>
        <Stack spacing={1.25}>
          <Skeleton variant="text" width="55%" height={18} />

          <Stack spacing={0.5}>
            <Skeleton variant="text" width="20%" height={14} />
            <Stack direction="row" spacing={0.75}>
              <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
              <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
            </Stack>
          </Stack>

          <Stack spacing={0.5}>
            <Skeleton variant="text" width="20%" height={14} />
            <Stack direction="row" spacing={0.75}>
              <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
              <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
            </Stack>
          </Stack>

          <Skeleton variant="rounded" height={32} />

          <Stack spacing={0.5}>
            <Skeleton variant="text" width="20%" height={14} />
            <Stack direction="row" spacing={0.5} flexWrap="wrap" rowGap={0.5}>
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={`weekday-skel-${index}`} variant="rounded" width={32} height={16} />
              ))}
            </Stack>
          </Stack>

          <Skeleton variant="rounded" height={36} />

          <Divider />
          <Skeleton variant="text" width="55%" height={18} />

          <Stack spacing={0.5}>
            <Skeleton variant="text" width="20%" height={14} />
            <Stack direction="row" spacing={0.75}>
              <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
              <Skeleton variant="rounded" height={36} sx={{ flex: 1 }} />
            </Stack>
          </Stack>

          <Stack spacing={0.5}>
            <Skeleton variant="text" width="20%" height={14} />
            <Stack direction="row" spacing={0.5} flexWrap="wrap" rowGap={0.5}>
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={`weekend-skel-${index}`} variant="rounded" width={32} height={16} />
              ))}
            </Stack>
          </Stack>

          <Skeleton variant="rounded" height={36} />

          <Stack direction="row" justifyContent="flex-end" spacing={0.75}>
            <Skeleton variant="rounded" width={64} height={28} />
            <Skeleton variant="rounded" width={88} height={28} />
          </Stack>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={1.25}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
          {baseForm.weekdayTitle}
        </Typography>

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
            disabled={!canSave}
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

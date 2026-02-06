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
import { panelSx } from './styles';

export function BaseForm({
  baseForm,
  onChange,
  onToggleWeekday,
  onToggleWeekend,
  onCancel,
  onSave
}) {
  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={1}>
        <Stack spacing={0.35}>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: '#22C55E',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}
          >
            Настройка режима
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
            {baseForm.weekdayTitle}
          </Typography>
        </Stack>

        <Stack spacing={0.5}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>
            Тип расписания
          </Typography>
          <FormControl size="small">
            <InputLabel>Тип расписания</InputLabel>
            <Select
              value={baseForm.scheduleType}
              label="Тип расписания"
              onChange={(e) => onChange({ scheduleType: e.target.value })}
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
              fullWidth
            />
            <TextField
              label="Окончание"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={baseForm.weekdayTo}
              onChange={(e) => onChange({ weekdayTo: e.target.value })}
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
              fullWidth
            />
            <TextField
              label="Время (окончание)"
              type="time"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={baseForm.weekdayTimeTo}
              onChange={(e) => onChange({ weekdayTimeTo: e.target.value })}
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

        <FormControl size="small">
          <InputLabel>Повторяемость</InputLabel>
          <Select
            value={baseForm.recurrence}
            label="Повторяемость"
            onChange={(e) => onChange({ recurrence: e.target.value })}
          >
            <MenuItem value="yearly">Каждый год</MenuItem>
            <MenuItem value="none">Отсутствует</MenuItem>
          </Select>
        </FormControl>

        {!baseForm.sameAsWeekdays && (
          <>
            <Divider />
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>
              Выходные дни
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
                  fullWidth
                />
                <TextField
                  label="Время (окончание)"
                  type="time"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={baseForm.weekendTimeTo}
                  onChange={(e) => onChange({ weekendTimeTo: e.target.value })}
                  fullWidth
                />
              </Stack>
            </Stack>

            <DaysSelector label="Дни" value={baseForm.weekendDays} onToggle={onToggleWeekend} />

            <FormControl size="small">
              <InputLabel>Повторяемость</InputLabel>
              <Select
                value={baseForm.recurrence}
                label="Повторяемость"
                onChange={(e) => onChange({ recurrence: e.target.value })}
              >
                <MenuItem value="yearly">Каждый год</MenuItem>
                <MenuItem value="none">Отсутствует</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        <Stack direction="row" justifyContent="flex-end" spacing={0.75}>
          <Button size="small" variant="outlined" color="inherit" onClick={onCancel}>
            Отмена
          </Button>
          <Button
            size="small"
            variant="contained"
            sx={{
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

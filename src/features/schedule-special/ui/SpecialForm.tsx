import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { panelSx } from '../../../shared/ui/schedulePanelStyles';
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
          {editingKind === 'special' ? 'Редактирование' : 'Создание'} специального расписания
        </Typography>
        <TextField
          label="Заголовок"
          size="small"
          value={specialForm.title}
          onChange={(e) => onChange({ title: e.target.value })}
          sx={fieldSx}
        />

        <Stack spacing={0.5}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>День</Typography>
          <Stack direction="row" spacing={0.75}>
            <TextField
              label="Начало"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={specialForm.dateFrom}
              onChange={(e) => onChange({ dateFrom: e.target.value })}
              sx={fieldSx}
              fullWidth
            />
            <TextField
              label="Окончание"
              type="date"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={specialForm.dateTo}
              onChange={(e) => onChange({ dateTo: e.target.value })}
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
              value={specialForm.timeFrom}
              onChange={(e) => onChange({ timeFrom: e.target.value })}
              sx={fieldSx}
              fullWidth
            />
            <TextField
              label="Время (окончание)"
              type="time"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={specialForm.timeTo}
              onChange={(e) => onChange({ timeTo: e.target.value })}
              sx={fieldSx}
              fullWidth
            />
          </Stack>
        </Stack>

        <FormControl size="small" sx={fieldSx} fullWidth>
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

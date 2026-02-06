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
  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={1}>
        <Stack spacing={0.35}>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: '#F59E0B',
              textTransform: 'uppercase',
              letterSpacing: '0.06em'
            }}
          >
            Специальный режим
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
            {editingKind === 'special' ? 'Редактирование' : 'Создание'} специального расписания
          </Typography>
        </Stack>
        <TextField
          label="Заголовок"
          size="small"
          value={specialForm.title}
          onChange={(e) => onChange({ title: e.target.value })}
        />

        <Stack direction="row" spacing={0.75}>
          <TextField
            label="Начало"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={specialForm.dateFrom}
            onChange={(e) => onChange({ dateFrom: e.target.value })}
            fullWidth
          />
          <TextField
            label="Окончание"
            type="date"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={specialForm.dateTo}
            onChange={(e) => onChange({ dateTo: e.target.value })}
            fullWidth
          />
        </Stack>

        <Stack direction="row" spacing={0.75}>
          <TextField
            label="Время с"
            type="time"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={specialForm.timeFrom}
            onChange={(e) => onChange({ timeFrom: e.target.value })}
            fullWidth
          />
          <TextField
            label="Время по"
            type="time"
            size="small"
            InputLabelProps={{ shrink: true }}
            value={specialForm.timeTo}
            onChange={(e) => onChange({ timeTo: e.target.value })}
            fullWidth
          />
        </Stack>

        <FormControl size="small">
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

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
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
import {
  AddRounded,
  DeleteOutline,
  EditOutlined,
  WarningAmberRounded
} from '@mui/icons-material';
import { DAY_LABEL, DAY_OPTIONS } from '../../constants/schedule';
import { formatDate } from '../../utils/calendar';

const panelSx = {
  p: 1.5,
  borderRadius: '12px',
  border: '1px solid #E6E8EC',
  boxShadow: '0px 10px 18px rgba(15, 23, 42, 0.04)',
  backgroundColor: '#FFFFFF'
};

const sectionTitleSx = {
  fontSize: 11,
  fontWeight: 700,
  color: '#111827',
  textTransform: 'uppercase',
  letterSpacing: '0.04em'
};

const cardSx = {
  borderRadius: '12px',
  borderColor: '#E6E8EC',
  backgroundColor: '#FFFFFF',
  boxShadow: '0px 6px 12px rgba(15, 23, 42, 0.04)'
};

function toggleDay(list, day) {
  return list.includes(day) ? list.filter((item) => item !== day) : [...list, day].sort((a, b) => a - b);
}

function DaysSelector({ label, value, onChange }) {
  return (
    <Stack spacing={0.5}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>{label}</Typography>
      <Stack direction="row" spacing={0.25} flexWrap="wrap">
        {DAY_OPTIONS.map((day) => (
          <FormControlLabel
            key={`${label}-${day.value}`}
            sx={{ mr: 0.5, '& .MuiFormControlLabel-label': { fontSize: 11, color: '#4B5563' } }}
            control={
              <Checkbox
                size="small"
                checked={value.includes(day.value)}
                onChange={() => onChange(toggleDay(value, day.value))}
                sx={{
                  color: '#D1D5DB',
                  '&.Mui-checked': { color: '#22C55E' }
                }}
              />
            }
            label={day.label}
          />
        ))}
      </Stack>
    </Stack>
  );
}

function BaseForm({ baseForm, onChange, onCancel, onSave }) {
  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={1}>
        <Stack spacing={0.35}>
          <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#22C55E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Настройка режима
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
            {baseForm.weekdayTitle}
          </Typography>
        </Stack>

        <Stack spacing={0.5}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Тип расписания</Typography>
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

        <DaysSelector label="Дни" value={baseForm.weekdayDays} onChange={(weekdayDays) => onChange({ weekdayDays })} />

        <FormControl size="small">
          <InputLabel>Повторяемость</InputLabel>
          <Select value={baseForm.recurrence} label="Повторяемость" onChange={(e) => onChange({ recurrence: e.target.value })}>
            <MenuItem value="yearly">Каждый год</MenuItem>
            <MenuItem value="none">Отсутствует</MenuItem>
          </Select>
        </FormControl>

        {!baseForm.sameAsWeekdays && (
          <>
            <Divider />
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>Выходные дни</Typography>

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

            <DaysSelector label="Дни" value={baseForm.weekendDays} onChange={(weekendDays) => onChange({ weekendDays })} />

            <FormControl size="small">
              <InputLabel>Повторяемость</InputLabel>
              <Select value={baseForm.recurrence} label="Повторяемость" onChange={(e) => onChange({ recurrence: e.target.value })}>
                <MenuItem value="yearly">Каждый год</MenuItem>
                <MenuItem value="none">Отсутствует</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        <Stack direction="row" justifyContent="flex-end" spacing={0.75}>
          <Button size="small" variant="outlined" color="inherit" onClick={onCancel}>Отмена</Button>
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

function SpecialForm({ specialForm, editingKind, onChange, onCancel, onSave }) {
  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={1}>
        <Stack spacing={0.35}>
          <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Специальный режим
          </Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
            {editingKind === 'special' ? 'Редактирование' : 'Создание'} специального расписания
          </Typography>
        </Stack>
        <TextField label="Заголовок" size="small" value={specialForm.title} onChange={(e) => onChange({ title: e.target.value })} />

        <Stack direction="row" spacing={0.75}>
          <TextField label="Начало" type="date" size="small" InputLabelProps={{ shrink: true }} value={specialForm.dateFrom} onChange={(e) => onChange({ dateFrom: e.target.value })} fullWidth />
          <TextField label="Окончание" type="date" size="small" InputLabelProps={{ shrink: true }} value={specialForm.dateTo} onChange={(e) => onChange({ dateTo: e.target.value })} fullWidth />
        </Stack>

        <Stack direction="row" spacing={0.75}>
          <TextField label="Время с" type="time" size="small" InputLabelProps={{ shrink: true }} value={specialForm.timeFrom} onChange={(e) => onChange({ timeFrom: e.target.value })} fullWidth />
          <TextField label="Время по" type="time" size="small" InputLabelProps={{ shrink: true }} value={specialForm.timeTo} onChange={(e) => onChange({ timeTo: e.target.value })} fullWidth />
        </Stack>

        <FormControl size="small">
          <InputLabel>Повторяемость</InputLabel>
          <Select value={specialForm.recurrence} label="Повторяемость" onChange={(e) => onChange({ recurrence: e.target.value })}>
            <MenuItem value="none">Отсутствует</MenuItem>
            <MenuItem value="yearly">Каждый год</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" justifyContent="flex-end" spacing={0.75}>
          <Button size="small" variant="outlined" color="inherit" onClick={onCancel}>Отмена</Button>
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

function BaseCards({ baseSchedules, onEdit, onDelete }) {
  if (baseSchedules.length === 0) return null;

  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.75}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22C55E' }} />
          <Typography sx={sectionTitleSx}>Основное расписание</Typography>
        </Stack>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              sx={{
                color: '#D1D5DB',
                '&.Mui-checked': { color: '#22C55E' }
              }}
            />
          }
          label={<Typography sx={{ fontSize: 10, color: '#6B7280' }}>Выбрать все</Typography>}
        />
      </Stack>
      <Stack spacing={0.75}>
        {baseSchedules.map((item) => (
          <Card key={item.id} variant="outlined" sx={{ ...cardSx, position: 'relative' }}>
            <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: '12px 0 0 12px', backgroundColor: '#22C55E' }} />
            <CardContent sx={{ px: 1.25, py: 0.9, '&:last-child': { pb: 0.9 } }}>
              <Typography sx={{ fontWeight: 700, fontSize: 12 }}>{item.title}</Typography>
              <Typography sx={{ fontSize: 11, color: '#64748B' }}>{formatDate(item.validFrom)} — {formatDate(item.validTo)}</Typography>
              <Typography sx={{ fontSize: 11, color: '#64748B' }}>{item.timeFrom} - {item.timeTo}</Typography>
              <Stack direction="row" spacing={0.25} mt={0.5} flexWrap="wrap">
                {item.daysOfWeek.map((day) => (
                  <Chip key={`${item.id}-${day}`} size="small" label={DAY_LABEL[day]} sx={{ height: 18, fontSize: 10, backgroundColor: '#F0FDF4' }} />
                ))}
              </Stack>
            </CardContent>
            <CardActions sx={{ px: 1.25, py: 0.5 }}>
              <Button size="small" startIcon={<EditOutlined fontSize="small" />} onClick={() => onEdit(item)} sx={{ color: '#16A34A' }}>Изменить</Button>
              <Button size="small" color="error" startIcon={<DeleteOutline fontSize="small" />} onClick={() => onDelete(item.id)}>Удалить</Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Paper>
  );
}

function SpecialCards({ specialSchedules, onEdit, onDelete }) {
  if (specialSchedules.length === 0) return null;

  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack direction="row" spacing={0.5} alignItems="center" mb={0.75}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
        <Typography sx={sectionTitleSx}>Специальное расписание</Typography>
      </Stack>
      <Stack spacing={0.75}>
        {specialSchedules.map((item) => {
          const from = new Date(item.dateFrom);
          const to = new Date(item.dateTo);
          const days = Math.max(1, Math.ceil((to - from) / 86400000) + 1);

          return (
            <Card key={item.id} variant="outlined" sx={{ ...cardSx, position: 'relative' }}>
              <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: '12px 0 0 12px', backgroundColor: '#F59E0B' }} />
              <CardContent sx={{ px: 1.25, py: 0.9, '&:last-child': { pb: 0.9 } }}>
                <Typography sx={{ fontWeight: 700, fontSize: 12 }}>{item.title}</Typography>
                <Typography sx={{ fontSize: 11, color: '#64748B' }}>{formatDate(item.dateFrom)} — {formatDate(item.dateTo)}</Typography>
                <Typography sx={{ fontSize: 11, color: '#64748B' }}>{days} дн.</Typography>
                <Typography sx={{ fontSize: 11, color: '#64748B' }}>{from.toISOString().slice(11, 16)} - {to.toISOString().slice(11, 16)}</Typography>
                <Typography sx={{ fontSize: 11, color: '#9CA3AF' }}>Причина: {item.reason || 'Ручная настройка'}</Typography>
              </CardContent>
              <CardActions sx={{ px: 1.25, py: 0.5 }}>
                <Button size="small" startIcon={<EditOutlined fontSize="small" />} onClick={() => onEdit(item)} sx={{ color: '#D97706' }}>Изменить</Button>
                <Button size="small" color="error" startIcon={<DeleteOutline fontSize="small" />} onClick={() => onDelete(item.id)}>Удалить</Button>
              </CardActions>
            </Card>
          );
        })}
      </Stack>
    </Paper>
  );
}

export function ScheduleSidebar({
  panelMode,
  hasAnySchedules,
  hasConflicts,
  notice,
  baseForm,
  specialForm,
  editing,
  baseSchedules,
  specialSchedules,
  loading,
  onBaseFormChange,
  onSpecialFormChange,
  onStartCreateBase,
  onStartCreateSpecial,
  onCancelForm,
  onSaveBase,
  onSaveSpecial,
  onClearAll,
  onEditBase,
  onDeleteBase,
  onEditSpecial,
  onDeleteSpecial
}) {
  return (
    <Stack spacing={1}>
      {notice && (
        <Alert
          icon={false}
          severity="success"
          sx={{
            py: 0.4,
            borderRadius: '10px',
            border: '1px solid #D1FAE5',
            backgroundColor: '#ECFDF3',
            '& .MuiAlert-message': { fontSize: 11, fontWeight: 700, color: '#065F46' }
          }}
        >
          {notice}
        </Alert>
      )}

      {hasConflicts && (
        <Alert
          icon={<WarningAmberRounded fontSize="small" />}
          severity="error"
          sx={{
            py: 0.35,
            borderRadius: '10px',
            border: '1px solid #FECACA',
            backgroundColor: '#FEF2F2',
            '& .MuiAlert-message': { fontSize: 11 }
          }}
        >
          Найдены пересекающиеся специальные интервалы с одинаковым приоритетом.
        </Alert>
      )}

      {!hasAnySchedules && panelMode === 'none' && (
        <Paper elevation={0} sx={panelSx}>
          <Stack spacing={1}>
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Режим работы не настроен</Typography>
            <Typography sx={{ fontSize: 11, color: '#6B7280' }}>Добавьте расписание вручную или загрузите готовый шаблон.</Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddRounded fontSize="small" />}
              sx={{
                alignSelf: 'flex-start',
                fontSize: 10,
                py: 0.5,
                px: 1.2,
                backgroundColor: '#22C55E',
                boxShadow: '0px 6px 12px rgba(34, 197, 94, 0.24)'
              }}
              onClick={onStartCreateBase}
            >
              Создать вручную
            </Button>
          </Stack>
        </Paper>
      )}

      {hasAnySchedules && panelMode === 'none' && (
        <Paper elevation={0} sx={panelSx}>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Button
              variant="contained"
              size="small"
              startIcon={<AddRounded fontSize="small" />}
              sx={{
                fontSize: 10,
                backgroundColor: '#22C55E',
                px: 1.2,
                boxShadow: '0px 6px 12px rgba(34, 197, 94, 0.24)'
              }}
              onClick={onStartCreateBase}
            >
              Создать
            </Button>
            <Button variant="outlined" size="small" sx={{ fontSize: 10, px: 1.2, borderColor: '#A7F3D0', color: '#059669' }} onClick={onStartCreateSpecial}>
              Создать +
            </Button>
            <Button size="small" sx={{ fontSize: 10, ml: 'auto' }} color="error" onClick={onClearAll}>
              Удалить все
            </Button>
          </Stack>
        </Paper>
      )}

      {panelMode === 'base-form' && (
        <BaseForm
          baseForm={baseForm}
          editingKind={editing?.kind}
          onChange={onBaseFormChange}
          onCancel={onCancelForm}
          onSave={onSaveBase}
        />
      )}

      {panelMode === 'special-form' && (
        <SpecialForm
          specialForm={specialForm}
          editingKind={editing?.kind}
          onChange={onSpecialFormChange}
          onCancel={onCancelForm}
          onSave={onSaveSpecial}
        />
      )}

      <BaseCards baseSchedules={baseSchedules} onEdit={onEditBase} onDelete={onDeleteBase} />
      <SpecialCards specialSchedules={specialSchedules} onEdit={onEditSpecial} onDelete={onDeleteSpecial} />

      {loading && (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={16} />
          <Typography sx={{ fontSize: 11 }}>Загрузка...</Typography>
        </Stack>
      )}
    </Stack>
  );
}




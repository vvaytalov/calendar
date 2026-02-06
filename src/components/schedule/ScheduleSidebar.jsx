import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
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
import { DAY_LABEL } from '../../constants/schedule';
import { formatDate } from '../../utils/calendar';

function BaseForm({ baseForm, editingKind, onChange, onCancel, onSave }) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Typography fontWeight={700}>{editingKind === 'base' ? 'Редактирование' : 'Создание'} основного расписания</Typography>
        <TextField label="Заголовок (будни)" size="small" value={baseForm.weekdayTitle} onChange={(e) => onChange({ weekdayTitle: e.target.value })} />

        <Stack direction="row" spacing={1}>
          <TextField label="С" type="date" size="small" InputLabelProps={{ shrink: true }} value={baseForm.weekdayFrom} onChange={(e) => onChange({ weekdayFrom: e.target.value })} />
          <TextField label="По" type="date" size="small" InputLabelProps={{ shrink: true }} value={baseForm.weekdayTo} onChange={(e) => onChange({ weekdayTo: e.target.value })} />
        </Stack>

        <Stack direction="row" spacing={1}>
          <TextField label="Время с" type="time" size="small" InputLabelProps={{ shrink: true }} value={baseForm.weekdayTimeFrom} onChange={(e) => onChange({ weekdayTimeFrom: e.target.value })} />
          <TextField label="Время по" type="time" size="small" InputLabelProps={{ shrink: true }} value={baseForm.weekdayTimeTo} onChange={(e) => onChange({ weekdayTimeTo: e.target.value })} />
        </Stack>

        <FormControlLabel
          control={<Checkbox checked={baseForm.sameAsWeekdays} onChange={(e) => onChange({ sameAsWeekdays: e.target.checked })} />}
          label="Будни и выходные совпадают"
        />

        {!baseForm.sameAsWeekdays && (
          <>
            <TextField label="Заголовок (выходные)" size="small" value={baseForm.weekendTitle} onChange={(e) => onChange({ weekendTitle: e.target.value })} />
            <Stack direction="row" spacing={1}>
              <TextField label="Выходные с" type="date" size="small" InputLabelProps={{ shrink: true }} value={baseForm.weekendFrom} onChange={(e) => onChange({ weekendFrom: e.target.value })} />
              <TextField label="Выходные по" type="date" size="small" InputLabelProps={{ shrink: true }} value={baseForm.weekendTo} onChange={(e) => onChange({ weekendTo: e.target.value })} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <TextField label="Время с" type="time" size="small" InputLabelProps={{ shrink: true }} value={baseForm.weekendTimeFrom} onChange={(e) => onChange({ weekendTimeFrom: e.target.value })} />
              <TextField label="Время по" type="time" size="small" InputLabelProps={{ shrink: true }} value={baseForm.weekendTimeTo} onChange={(e) => onChange({ weekendTimeTo: e.target.value })} />
            </Stack>
          </>
        )}

        <FormControl size="small">
          <InputLabel>Повторяемость</InputLabel>
          <Select value={baseForm.recurrence} label="Повторяемость" onChange={(e) => onChange({ recurrence: e.target.value })}>
            <MenuItem value="yearly">Каждый год</MenuItem>
            <MenuItem value="none">Без повтора</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={onCancel}>Отмена</Button>
          <Button variant="contained" onClick={onSave}>Сохранить</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

function SpecialForm({ specialForm, editingKind, onChange, onCancel, onSave }) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Typography fontWeight={700}>{editingKind === 'special' ? 'Редактирование' : 'Создание'} специального расписания</Typography>
        <TextField label="Заголовок" size="small" value={specialForm.title} onChange={(e) => onChange({ title: e.target.value })} />

        <Stack direction="row" spacing={1}>
          <TextField label="С" type="date" size="small" InputLabelProps={{ shrink: true }} value={specialForm.dateFrom} onChange={(e) => onChange({ dateFrom: e.target.value })} />
          <TextField label="По" type="date" size="small" InputLabelProps={{ shrink: true }} value={specialForm.dateTo} onChange={(e) => onChange({ dateTo: e.target.value })} />
        </Stack>

        <Stack direction="row" spacing={1}>
          <TextField label="Время с" type="time" size="small" InputLabelProps={{ shrink: true }} value={specialForm.timeFrom} onChange={(e) => onChange({ timeFrom: e.target.value })} />
          <TextField label="Время по" type="time" size="small" InputLabelProps={{ shrink: true }} value={specialForm.timeTo} onChange={(e) => onChange({ timeTo: e.target.value })} />
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={onCancel}>Отмена</Button>
          <Button variant="contained" onClick={onSave}>Сохранить</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

function BaseCards({ baseSchedules, onEdit, onDelete }) {
  if (baseSchedules.length === 0) return null;

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography fontWeight={700} mb={1}>Основное расписание</Typography>
      <Stack spacing={1}>
        {baseSchedules.map((item) => (
          <Card key={item.id} variant="outlined">
            <CardContent sx={{ pb: 1 }}>
              <Typography fontWeight={600}>{item.title}</Typography>
              <Typography variant="body2">{formatDate(item.validFrom)} — {formatDate(item.validTo)}</Typography>
              <Typography variant="body2">{item.timeFrom} - {item.timeTo}</Typography>
              <Stack direction="row" spacing={0.5} mt={1} flexWrap="wrap">
                {item.daysOfWeek.map((day) => <Chip key={`${item.id}-${day}`} size="small" label={DAY_LABEL[day]} />)}
              </Stack>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => onEdit(item)}>Редактировать</Button>
              <Button size="small" color="error" onClick={() => onDelete(item.id)}>Удалить</Button>
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
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography fontWeight={700} mb={1}>Специальное расписание</Typography>
      <Stack spacing={1}>
        {specialSchedules.map((item) => {
          const from = new Date(item.dateFrom);
          const to = new Date(item.dateTo);
          const days = Math.max(1, Math.ceil((to - from) / 86400000) + 1);

          return (
            <Card key={item.id} variant="outlined">
              <CardContent sx={{ pb: 1 }}>
                <Typography fontWeight={600}>{item.title}</Typography>
                <Typography variant="body2">{formatDate(item.dateFrom)} — {formatDate(item.dateTo)}</Typography>
                <Typography variant="body2">{days} дн.</Typography>
                <Typography variant="body2">{from.toISOString().slice(11, 16)} - {to.toISOString().slice(11, 16)}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => onEdit(item)}>Редактировать</Button>
                <Button size="small" color="error" onClick={() => onDelete(item.id)}>Удалить</Button>
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
    <Stack spacing={2}>
      {!hasAnySchedules && panelMode === 'none' && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Alert severity="warning">Режим работы не настроен</Alert>
            <Button variant="contained" onClick={onStartCreateBase}>Создать расписание</Button>
          </Stack>
        </Paper>
      )}

      {hasAnySchedules && panelMode === 'none' && (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={onStartCreateBase}>Создать расписание</Button>
            <Button variant="outlined" onClick={onStartCreateSpecial}>Создать +</Button>
          </Stack>
          <Button sx={{ mt: 1 }} color="error" onClick={onClearAll}>Удалить все</Button>
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
          <CircularProgress size={18} />
          <Typography variant="body2">Загрузка...</Typography>
        </Stack>
      )}
    </Stack>
  );
}

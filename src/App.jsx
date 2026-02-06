import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Container, Grid, Paper, Stack, Typography } from '@mui/material';
import { ScheduleService } from './service/scheduleService';
import { ZoneScheduleStore } from './store/zoneScheduleStore';
import { BASE_FORM_TEMPLATE, SPECIAL_FORM_TEMPLATE } from './constants/schedule';
import { toDateInput } from './utils/calendar';
import { YearCalendar } from './components/schedule/YearCalendar';
import { ScheduleSidebar } from './components/schedule/ScheduleSidebar';

const storeFactory = () => new ZoneScheduleStore(new ScheduleService());

const App = observer(() => {
  const store = useMemo(storeFactory, []);
  const [panelMode, setPanelMode] = useState('none');
  const [notice, setNotice] = useState('');
  const [baseForm, setBaseForm] = useState(BASE_FORM_TEMPLATE);
  const [specialForm, setSpecialForm] = useState(SPECIAL_FORM_TEMPLATE);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    store.load();
  }, [store]);

  const hasAnySchedules = store.baseSchedules.length > 0 || store.specialSchedules.length > 0;

  const onBaseFormChange = (patch) => setBaseForm((prev) => ({ ...prev, ...patch }));
  const onSpecialFormChange = (patch) => setSpecialForm((prev) => ({ ...prev, ...patch }));

  const resetEditing = () => {
    setEditing(null);
    setPanelMode('none');
  };

  const onSaveBase = async () => {
    const weekdayPayload = {
      title: baseForm.weekdayTitle,
      timeFrom: baseForm.weekdayTimeFrom,
      timeTo: baseForm.weekdayTimeTo,
      daysOfWeek: [1, 2, 3, 4, 5],
      validFrom: baseForm.weekdayFrom,
      validTo: baseForm.weekdayTo
    };

    const weekendPayload = {
      title: baseForm.weekendTitle,
      timeFrom: baseForm.sameAsWeekdays ? baseForm.weekdayTimeFrom : baseForm.weekendTimeFrom,
      timeTo: baseForm.sameAsWeekdays ? baseForm.weekdayTimeTo : baseForm.weekendTimeTo,
      daysOfWeek: [6, 7],
      validFrom: baseForm.sameAsWeekdays ? baseForm.weekdayFrom : baseForm.weekendFrom,
      validTo: baseForm.sameAsWeekdays ? baseForm.weekdayTo : baseForm.weekendTo
    };

    if (editing?.kind === 'base') {
      await store.editBase(editing.id, weekdayPayload);
      setNotice('Основное расписание обновлено');
    } else {
      await store.addBase(weekdayPayload);
      await store.addBase(weekendPayload);
      setNotice('Основное расписание создано');
    }

    resetEditing();
  };

  const onSaveSpecial = async () => {
    const payload = {
      title: specialForm.title,
      dateFrom: new Date(`${specialForm.dateFrom}T${specialForm.timeFrom}:00`).toISOString(),
      dateTo: new Date(`${specialForm.dateTo}T${specialForm.timeTo}:00`).toISOString(),
      priority: 100,
      reason: 'Ручная настройка',
      isOverrideBase: true
    };

    if (editing?.kind === 'special') {
      await store.editSpecial(editing.id, payload);
      setNotice('Специальное расписание обновлено');
    } else {
      await store.addSpecial(payload);
      setNotice('Специальное расписание создано');
    }

    setSpecialForm(SPECIAL_FORM_TEMPLATE);
    resetEditing();
  };

  const onEditBase = (item) => {
    setEditing({ kind: 'base', id: item.id });
    setBaseForm((prev) => ({
      ...prev,
      weekdayTitle: item.title,
      weekdayFrom: toDateInput(item.validFrom),
      weekdayTo: toDateInput(item.validTo),
      weekdayTimeFrom: item.timeFrom,
      weekdayTimeTo: item.timeTo
    }));
    setPanelMode('base-form');
  };

  const onEditSpecial = (item) => {
    const from = new Date(item.dateFrom);
    const to = new Date(item.dateTo);

    setEditing({ kind: 'special', id: item.id });
    setSpecialForm({
      ...SPECIAL_FORM_TEMPLATE,
      title: item.title,
      dateFrom: toDateInput(from),
      dateTo: toDateInput(to),
      timeFrom: from.toISOString().slice(11, 16),
      timeTo: to.toISOString().slice(11, 16)
    });
    setPanelMode('special-form');
  };

  const onDeleteBase = async (id) => {
    await store.removeBase(id);
    setNotice('Расписание удалено');
  };

  const onDeleteSpecial = async (id) => {
    await store.removeSpecial(id);
    setNotice('Расписание удалено');
  };

  const onClearAll = async () => {
    await store.clearAll();
    setNotice('Все расписания удалены');
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 2.5, backgroundColor: '#F5F7FB' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1.5, md: 2 } }}>
        <Stack spacing={1.5}>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>Календарь зоны 24</Typography>

          {store.error && <Alert severity="error">{store.error}</Alert>}
          {notice && <Alert severity="success" onClose={() => setNotice('')}>{notice}</Alert>}

          <Grid container spacing={1.5}>
            <Grid item xs={12} md={4} lg={3}>
              <ScheduleSidebar
                panelMode={panelMode}
                hasAnySchedules={hasAnySchedules}
                baseForm={baseForm}
                specialForm={specialForm}
                editing={editing}
                baseSchedules={store.baseSchedules}
                specialSchedules={store.specialSchedules}
                loading={store.loading}
                onBaseFormChange={onBaseFormChange}
                onSpecialFormChange={onSpecialFormChange}
                onStartCreateBase={() => {
                  setEditing(null);
                  setPanelMode('base-form');
                }}
                onStartCreateSpecial={() => {
                  setEditing(null);
                  setPanelMode('special-form');
                }}
                onCancelForm={resetEditing}
                onSaveBase={onSaveBase}
                onSaveSpecial={onSaveSpecial}
                onClearAll={onClearAll}
                onEditBase={onEditBase}
                onDeleteBase={onDeleteBase}
                onEditSpecial={onEditSpecial}
                onDeleteSpecial={onDeleteSpecial}
              />
            </Grid>

            <Grid item xs={12} md={8} lg={9}>
              <Paper elevation={0} sx={{ p: 1.5, borderRadius: "14px", border: "1px solid #E5E9F2" }}>
                <YearCalendar baseSchedules={store.baseSchedules} specialSchedules={store.specialSchedules} />
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
});

export default App;

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

function TopLine() {
  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ py: 0.25, borderBottom: '1px solid #EEF2F7' }}>
      <Typography sx={{ fontSize: 10, color: '#64748B' }}>Системный УВД</Typography>
      <Typography sx={{ fontSize: 10, color: '#64748B' }}>Контроль</Typography>
      <Typography sx={{ fontSize: 10, color: '#111827', fontWeight: 700 }}>Режим работы</Typography>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', border: '1px solid #FCA5A5' }} />
    </Stack>
  );
}

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

  const findBaseByDays = (days) => store.baseSchedules.find((item) => item.daysOfWeek.length === days.length && days.every((d) => item.daysOfWeek.includes(d)));

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
      daysOfWeek: baseForm.weekdayDays,
      validFrom: baseForm.weekdayFrom,
      validTo: baseForm.weekdayTo
    };

    const weekendPayload = {
      title: baseForm.weekendTitle,
      timeFrom: baseForm.sameAsWeekdays ? baseForm.weekdayTimeFrom : baseForm.weekendTimeFrom,
      timeTo: baseForm.sameAsWeekdays ? baseForm.weekdayTimeTo : baseForm.weekendTimeTo,
      daysOfWeek: baseForm.weekendDays,
      validFrom: baseForm.sameAsWeekdays ? baseForm.weekdayFrom : baseForm.weekendFrom,
      validTo: baseForm.sameAsWeekdays ? baseForm.weekdayTo : baseForm.weekendTo
    };

    if (editing?.kind === 'base') {
      const weekdayExisting = findBaseByDays(baseForm.weekdayDays);
      const weekendExisting = findBaseByDays(baseForm.weekendDays);

      if (weekdayExisting) await store.editBase(weekdayExisting.id, weekdayPayload);
      else await store.addBase(weekdayPayload);

      if (!baseForm.sameAsWeekdays) {
        if (weekendExisting) await store.editBase(weekendExisting.id, weekendPayload);
        else await store.addBase(weekendPayload);
      } else if (weekendExisting) {
        await store.removeBase(weekendExisting.id);
      }

      setNotice('Основное расписание обновлено');
    } else {
      await store.addBase(weekdayPayload);
      if (!baseForm.sameAsWeekdays) {
        await store.addBase(weekendPayload);
      }
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
    const weekdayExisting = findBaseByDays([1, 2, 3, 4, 5]) || item;
    const weekendExisting = findBaseByDays([6, 7]);

    setEditing({ kind: 'base', id: item.id });
    setBaseForm((prev) => ({
      ...prev,
      weekdayTitle: weekdayExisting?.title || prev.weekdayTitle,
      weekdayFrom: toDateInput(weekdayExisting?.validFrom),
      weekdayTo: toDateInput(weekdayExisting?.validTo),
      weekdayTimeFrom: weekdayExisting?.timeFrom || prev.weekdayTimeFrom,
      weekdayTimeTo: weekdayExisting?.timeTo || prev.weekdayTimeTo,
      weekdayDays: weekdayExisting?.daysOfWeek || prev.weekdayDays,
      weekendTitle: weekendExisting?.title || prev.weekendTitle,
      weekendFrom: toDateInput(weekendExisting?.validFrom),
      weekendTo: toDateInput(weekendExisting?.validTo),
      weekendTimeFrom: weekendExisting?.timeFrom || prev.weekendTimeFrom,
      weekendTimeTo: weekendExisting?.timeTo || prev.weekendTimeTo,
      weekendDays: weekendExisting?.daysOfWeek || prev.weekendDays,
      sameAsWeekdays: !weekendExisting
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
    if (!window.confirm('Удалить все расписания?')) return;
    await store.clearAll();
    setNotice('Все расписания удалены');
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 1.25, backgroundColor: '#F8FAFC' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, md: 1.5 } }}>
        <Stack spacing={1}>
          <TopLine />

          {store.error && <Alert severity="error">{store.error}</Alert>}

          <Grid container spacing={1}>
            <Grid item xs={12} md={3.3} lg={2.9}>
              <ScheduleSidebar
                panelMode={panelMode}
                hasAnySchedules={hasAnySchedules}
                notice={notice}
                baseForm={baseForm}
                specialForm={specialForm}
                editing={editing}
                baseSchedules={store.baseSchedules}
                specialSchedules={store.specialSchedules}
                loading={store.loading}
                onBaseFormChange={onBaseFormChange}
                onSpecialFormChange={onSpecialFormChange}
                onStartCreateBase={() => {
                  setNotice('');
                  setEditing(null);
                  setPanelMode('base-form');
                }}
                onStartCreateSpecial={() => {
                  setNotice('');
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

            <Grid item xs={12} md={8.7} lg={9.1}>
              <Paper elevation={0} sx={{ p: 1, borderRadius: '8px', border: '1px solid #EBEEF5' }}>
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

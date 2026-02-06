import { Grid, Stack, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { CalendarLegend } from './calendar/CalendarLegend';
import { CalendarMonth } from './calendar/CalendarMonth';

export const YearCalendar = observer(({ store }) => {
  const calendarStore = store.calendarStore;

  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Typography sx={{ fontSize: 10, color: '#94A3B8' }}>{calendarStore.year - 1}</Typography>
          <Typography sx={{ fontSize: 11, color: '#16A34A', fontWeight: 700 }}>{calendarStore.year}</Typography>
        </Stack>
        <CalendarLegend items={calendarStore.legendItems} />
      </Stack>

      <Grid container spacing={1}>
        {calendarStore.months.map((month) => (
          <CalendarMonth
            key={month.key}
            month={month}
            onHoverCell={calendarStore.onHoverCell}
            onLeaveCell={calendarStore.onLeaveCell}
            onChangeMode={store.changeModeFromCalendar}
          />
        ))}
      </Grid>
    </Stack>
  );
});

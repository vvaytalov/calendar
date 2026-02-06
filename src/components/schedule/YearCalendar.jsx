import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { MONTHS, WEEKDAYS } from '../../constants/schedule';
import { dayNumber, inRange, isWeekend } from '../../utils/calendar';

const COLORS = {
  textMuted: '#94A3B8',
  weekday: '#22C55E',
  weekend: '#16A34A',
  special: '#F59E0B',
  border: '#E5E7EB',
  surface: '#FFFFFF'
};

function resolveDayStatus(date, baseSchedules, specialSchedules) {
  const hasSpecial = specialSchedules.some((item) => inRange(date, item.dateFrom, item.dateTo));
  if (hasSpecial) return 'special';

  const day = dayNumber(date);
  const activeBase = baseSchedules.find((item) => inRange(date, item.validFrom, item.validTo) && item.daysOfWeek.includes(day));

  if (!activeBase) return 'none';
  return isWeekend(date) ? 'weekend' : 'weekday';
}

function getMonthCells(year, monthIndex) {
  const monthStart = new Date(year, monthIndex, 1);
  const monthEnd = new Date(year, monthIndex + 1, 0);
  const daysInMonth = monthEnd.getDate();
  const firstWeekDay = (monthStart.getDay() + 6) % 7;

  const cells = [];
  for (let i = 0; i < firstWeekDay; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, monthIndex, day));

  return cells;
}

function LegendItem({ color, label }) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: color }} />
      <Typography sx={{ fontSize: 10, color: '#6B7280' }}>{label}</Typography>
    </Stack>
  );
}

export function YearCalendar({ baseSchedules, specialSchedules }) {
  const year = new Date().getFullYear();

  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Typography sx={{ fontSize: 10, color: '#A3AAB8' }}>{year - 1}</Typography>
          <Typography sx={{ fontSize: 10, color: '#22C55E', fontWeight: 700 }}>{year}</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <LegendItem color={COLORS.weekday} label="Будни" />
          <LegendItem color={COLORS.weekend} label="Выходные" />
          <LegendItem color={COLORS.special} label="Специальные" />
        </Stack>
      </Stack>

      <Grid container spacing={1}>
        {MONTHS.map((month, monthIndex) => {
          const cells = getMonthCells(year, monthIndex);

          return (
            <Grid item xs={12} md={6} lg={3} key={month}>
              <Paper
                elevation={0}
                sx={{
                  px: 1,
                  py: 0.75,
                  borderRadius: '8px',
                  border: `1px solid ${COLORS.border}`,
                  backgroundColor: COLORS.surface,
                  minHeight: 132
                }}
              >
                <Typography sx={{ fontSize: 10, fontWeight: 700, lineHeight: '14px', mb: 0.5, textAlign: 'center' }}>{month}</Typography>

                <Grid container columns={7} mb={0.25}>
                  {WEEKDAYS.map((d) => (
                    <Grid item xs={1} key={`${month}-h-${d}`}>
                      <Typography sx={{ fontSize: 8.5, color: '#98A2B3', textAlign: 'center' }}>{d}</Typography>
                    </Grid>
                  ))}
                </Grid>

                <Grid container columns={7} spacing={0.25}>
                  {cells.map((cell, index) => {
                    const status = cell ? resolveDayStatus(cell, baseSchedules, specialSchedules) : 'none';
                    const isActive = status !== 'none';
                    const color = status === 'special' ? COLORS.special : status === 'weekend' ? COLORS.weekend : status === 'weekday' ? COLORS.weekday : COLORS.textMuted;

                    return (
                      <Grid item xs={1} key={`${month}-${index}`}>
                        <Box
                          sx={{
                            height: 18,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 8.5,
                            fontWeight: 600,
                            color: cell ? color : 'transparent'
                          }}
                        >
                          <Typography component="span" sx={{ fontSize: 8.5, lineHeight: 1 }}>
                            {cell ? cell.getDate() : ''}
                          </Typography>
                          <Box
                            sx={{
                              width: 4,
                              height: 4,
                              borderRadius: '50%',
                              mt: 0.2,
                              backgroundColor: isActive ? color : 'transparent'
                            }}
                          />
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
}

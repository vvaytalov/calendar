<<<<<<< codex/implement-schedule-management-for-zone24-cpj0ux
import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
=======
import { Box, Grid, Paper, Typography } from '@mui/material';
>>>>>>> main
import { MONTHS, WEEKDAYS } from '../../constants/schedule';
import { dayNumber, inRange, isWeekend } from '../../utils/calendar';

const COLORS = {
  default: '#ffffff',
<<<<<<< codex/implement-schedule-management-for-zone24-cpj0ux
  weekday: '#86EFAC',
  weekend: '#22C55E',
  special: '#F59E0B',
  border: '#ECF0F6'
=======
  weekday: '#7BC67E',
  weekend: '#2F8E46',
  special: '#F4A640',
  border: '#E5E9F2'
>>>>>>> main
};

function resolveDayColor(date, baseSchedules, specialSchedules) {
  const hasSpecial = specialSchedules.some((item) => inRange(date, item.dateFrom, item.dateTo));
  if (hasSpecial) return COLORS.special;

  const day = dayNumber(date);
  const activeBase = baseSchedules.find((item) => inRange(date, item.validFrom, item.validTo) && item.daysOfWeek.includes(day));

  if (!activeBase) return COLORS.default;
  return isWeekend(date) ? COLORS.weekend : COLORS.weekday;
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

export function YearCalendar({ baseSchedules, specialSchedules }) {
  const year = new Date().getFullYear();

  return (
<<<<<<< codex/implement-schedule-management-for-zone24-cpj0ux
    <Stack spacing={0.75}>
      <Stack direction="row" justifyContent="center" spacing={7}>
        <Typography sx={{ fontSize: 10, color: '#A3AAB8' }}>{year - 1}</Typography>
        <Typography sx={{ fontSize: 10, color: '#22C55E', fontWeight: 700 }}>{year}</Typography>
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
                  borderRadius: '6px',
                  border: `1px solid ${COLORS.border}`,
                  backgroundColor: '#fff',
                  minHeight: 122
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
                  {cells.map((cell, index) => (
                    <Grid item xs={1} key={`${month}-${index}`}>
                      <Box
                        sx={{
                          height: 13,
                          borderRadius: '3px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 8,
                          fontWeight: 500,
                          color: '#334155',
                          backgroundColor: cell ? resolveDayColor(cell, baseSchedules, specialSchedules) : 'transparent'
                        }}
                      >
                        {cell ? cell.getDate() : ''}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Stack>
=======
    <Grid container spacing={1.5}>
      {MONTHS.map((month, monthIndex) => {
        const cells = getMonthCells(year, monthIndex);

        return (
          <Grid item xs={12} md={6} lg={4} key={month}>
            <Paper
              elevation={0}
              sx={{
                px: 1.25,
                py: 1,
                borderRadius: '12px',
                border: `1px solid ${COLORS.border}`,
                backgroundColor: '#fff',
                minHeight: 218
              }}
            >
              <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: '18px', mb: 1 }}>{month}</Typography>

              <Grid container columns={7} mb={0.5}>
                {WEEKDAYS.map((d) => (
                  <Grid item xs={1} key={`${month}-h-${d}`}>
                    <Typography sx={{ fontSize: 11, color: '#8A94A6', textAlign: 'center', fontWeight: 600 }}>{d}</Typography>
                  </Grid>
                ))}
              </Grid>

              <Grid container columns={7} spacing={0.5}>
                {cells.map((cell, index) => (
                  <Grid item xs={1} key={`${month}-${index}`}>
                    <Box
                      sx={{
                        height: 24,
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 500,
                        color: '#1F2A37',
                        backgroundColor: cell ? resolveDayColor(cell, baseSchedules, specialSchedules) : 'transparent',
                        border: cell ? `1px solid ${COLORS.border}` : 'none'
                      }}
                    >
                      {cell ? cell.getDate() : ''}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
>>>>>>> main
  );
}

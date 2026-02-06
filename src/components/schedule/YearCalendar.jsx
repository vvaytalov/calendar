import { Box, Grid, Paper, Typography } from '@mui/material';
import { MONTHS, WEEKDAYS } from '../../constants/schedule';
import { dayNumber, inRange, isWeekend } from '../../utils/calendar';

function resolveDayColor(date, baseSchedules, specialSchedules) {
  const hasSpecial = specialSchedules.some((item) => inRange(date, item.dateFrom, item.dateTo));
  if (hasSpecial) return '#f6a623';

  const day = dayNumber(date);
  const activeBase = baseSchedules.find((item) => inRange(date, item.validFrom, item.validTo) && item.daysOfWeek.includes(day));

  if (!activeBase) return '#ffffff';
  return isWeekend(date) ? '#2e7d32' : '#66bb6a';
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
    <Grid container spacing={2}>
      {MONTHS.map((month, monthIndex) => {
        const cells = getMonthCells(year, monthIndex);

        return (
          <Grid item xs={12} md={6} lg={4} key={month}>
            <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
              <Typography fontWeight={700} mb={1}>{month}</Typography>

              <Grid container columns={7} mb={1}>
                {WEEKDAYS.map((d) => (
                  <Grid item xs={1} key={`${month}-h-${d}`}>
                    <Typography variant="caption" color="text.secondary">{d}</Typography>
                  </Grid>
                ))}
              </Grid>

              <Grid container columns={7} spacing={0.5}>
                {cells.map((cell, index) => (
                  <Grid item xs={1} key={`${month}-${index}`}>
                    <Box
                      sx={{
                        height: 28,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        backgroundColor: cell ? resolveDayColor(cell, baseSchedules, specialSchedules) : 'transparent',
                        border: cell ? '1px solid #e6e8ef' : 'none'
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
  );
}

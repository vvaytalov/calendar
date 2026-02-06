import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { MONTHS, WEEKDAYS } from '../../constants/schedule';
import { dayNumber, inRange, isWeekend } from '../../utils/calendar';

const COLORS = {
  textMuted: '#94A3B8',
  weekday: '#22C55E',
  weekend: '#16A34A',
  special: '#F59E0B',
  border: '#E6E8EC',
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

function toDateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function YearCalendar({ baseSchedules, specialSchedules, onChangeMode }) {
  const year = new Date().getFullYear();
  const [hoveredKey, setHoveredKey] = useState(null);

  return (
    <Stack spacing={1}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Typography sx={{ fontSize: 10, color: '#94A3B8' }}>{year - 1}</Typography>
          <Typography sx={{ fontSize: 11, color: '#16A34A', fontWeight: 700 }}>{year}</Typography>
        </Stack>
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 0.75, py: 0.35, borderRadius: '999px', backgroundColor: '#ECFDF3', border: '1px solid #D1FAE5' }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: COLORS.weekday }} />
            <Typography sx={{ fontSize: 9.5, color: '#065F46', fontWeight: 600 }}>Будни</Typography>
          </Box>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 0.75, py: 0.35, borderRadius: '999px', backgroundColor: '#ECFDF3', border: '1px solid #D1FAE5' }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: COLORS.weekend }} />
            <Typography sx={{ fontSize: 9.5, color: '#065F46', fontWeight: 600 }}>Выходные</Typography>
          </Box>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, px: 0.75, py: 0.35, borderRadius: '999px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: COLORS.special }} />
            <Typography sx={{ fontSize: 9.5, color: '#92400E', fontWeight: 600 }}>Специальные</Typography>
          </Box>
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
                  py: 0.85,
                  borderRadius: '12px',
                  border: `1px solid ${COLORS.border}`,
                  backgroundColor: COLORS.surface,
                  minHeight: 140,
                  boxShadow: '0px 10px 18px rgba(15, 23, 42, 0.04)'
                }}
              >
                <Typography sx={{ fontSize: 10, fontWeight: 700, lineHeight: '14px', mb: 0.5, textAlign: 'center' }}>{month}</Typography>

                <Grid container columns={7} mb={0.25}>
                  {WEEKDAYS.map((d) => (
                    <Grid item xs={1} key={`${month}-h-${d}`}>
                      <Typography sx={{ fontSize: 8.5, color: '#94A3B8', textAlign: 'center' }}>{d}</Typography>
                    </Grid>
                  ))}
                </Grid>

                <Grid container columns={7} spacing={0.25}>
                  {cells.map((cell, index) => {
                    const status = cell ? resolveDayStatus(cell, baseSchedules, specialSchedules) : 'none';
                    const isActive = status !== 'none';
                    const color = status === 'special' ? COLORS.special : status === 'weekend' ? COLORS.weekend : status === 'weekday' ? COLORS.weekday : COLORS.textMuted;
                    const dateKey = cell ? toDateKey(cell) : null;
                    const isHovered = cell && hoveredKey === dateKey;

                    return (
                      <Grid item xs={1} key={`${month}-${index}`}>
                        <Box
                          onMouseEnter={() => {
                            if (cell) setHoveredKey(dateKey);
                          }}
                          onMouseLeave={() => {
                            if (cell) setHoveredKey(null);
                          }}
                          sx={{
                            position: 'relative',
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {isHovered && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: -30,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 2,
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                boxShadow: '0px 6px 12px rgba(15, 23, 42, 0.08)',
                                px: 0.5,
                                py: 0.25,
                                '&::after': {
                                  content: '""',
                                  position: 'absolute',
                                  bottom: -4,
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  width: 6,
                                  height: 6,
                                  backgroundColor: '#FFFFFF',
                                  borderRight: '1px solid #E5E7EB',
                                  borderBottom: '1px solid #E5E7EB',
                                  transformOrigin: 'center',
                                  rotate: '45deg'
                                }
                              }}
                            >
                              <Button
                                size="small"
                                variant="text"
                                onClick={() => onChangeMode?.(cell)}
                                sx={{
                                  fontSize: 9,
                                  fontWeight: 600,
                                  color: '#16A34A',
                                  minWidth: 'auto',
                                  px: 0.5,
                                  py: 0,
                                  lineHeight: 1.2
                                }}
                              >
                                Изменить режим работы
                              </Button>
                            </Box>
                          )}
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 8.5,
                              fontWeight: 600,
                              color: cell ? color : 'transparent',
                              backgroundColor: isHovered ? '#DCFCE7' : 'transparent'
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

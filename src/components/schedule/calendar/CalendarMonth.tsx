import { Grid, Paper, Typography } from '@mui/material';
import { CalendarDayCell } from './CalendarDayCell';
import { CALENDAR_COLORS } from '../../../constants/calendar';
import type { CalendarCell, CalendarMonthView } from '../../../domain/calendar/types';

interface CalendarMonthProps {
  month: CalendarMonthView;
  onHoverCell: (cell: CalendarCell) => void;
  onLeaveCell: (cell: CalendarCell) => void;
  onChangeMode: (date: Date) => void;
}

export function CalendarMonth({ month, onHoverCell, onLeaveCell, onChangeMode }: CalendarMonthProps) {
  return (
    <Grid item xs={12} md={6} lg={3}>
      <Paper
        elevation={0}
        sx={{
          px: 1,
          py: 0.85,
          borderRadius: '12px',
          border: `1px solid ${CALENDAR_COLORS.border}`,
          backgroundColor: CALENDAR_COLORS.surface,
          minHeight: 140,
          boxShadow: '0px 10px 18px rgba(15, 23, 42, 0.04)'
        }}
      >
        <Typography
          sx={{ fontSize: 10, fontWeight: 700, lineHeight: '14px', mb: 0.5, textAlign: 'center' }}
        >
          {month.label}
        </Typography>

        <Grid container columns={7} mb={0.25}>
          {month.weekdays.map((day) => (
            <Grid item xs={1} key={`${month.key}-h-${day}`}>
              <Typography sx={{ fontSize: 8.5, color: '#94A3B8', textAlign: 'center' }}>
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        <Grid container columns={7} spacing={0.25}>
          {month.cells.map((cell) => (
            <CalendarDayCell
              key={cell.key}
              cell={cell}
              onHover={onHoverCell}
              onLeave={onLeaveCell}
              onChangeMode={onChangeMode}
            />
          ))}
        </Grid>
      </Paper>
    </Grid>
  );
}

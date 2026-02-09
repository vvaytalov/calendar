import { Box, Button, Grid, Typography } from '@mui/material';
import type { CalendarCell } from '../../../entities/calendar/model/types';

interface CalendarDayCellProps {
  cell: CalendarCell;
  onHover: (cell: CalendarCell) => void;
  onLeave: (cell: CalendarCell) => void;
  onChangeMode?: (date: Date) => void;
}

export function CalendarDayCell({ cell, onHover, onLeave, onChangeMode }: CalendarDayCellProps) {
  return (
    <Grid item xs={1}>
      <Box
        onMouseEnter={() => onHover(cell)}
        onMouseLeave={() => onLeave(cell)}
        sx={{
          position: 'relative',
          height: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {cell.isHovered && (
          <Box
            sx={{
              position: 'absolute',
              top: -48,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              backgroundColor: '#FFFFFF',
              border: '1px solid #EEF2F7',
              borderRadius: '12px',
              boxShadow: '0px 6px 18px rgba(15, 23, 42, 0.12)',
              px: 1.25,
              py: 0.5,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -6,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 10,
                height: 10,
                backgroundColor: '#FFFFFF',
                borderRight: '1px solid #EEF2F7',
                borderBottom: '1px solid #EEF2F7',
                transformOrigin: 'center',
                rotate: '45deg'
              }
            }}
          >
            <Button
              size="small"
              variant="text"
              onClick={() => {
                if (cell.date) onChangeMode?.(cell.date);
              }}
              sx={{
                fontSize: 11,
                fontWeight: 600,
                color: '#7C8FF2',
                minWidth: 'auto',
                px: 0.75,
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
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 8.5,
            fontWeight: 600,
            color: cell.isEmpty ? 'transparent' : cell.color,
            backgroundColor: cell.isHovered ? '#DCFCE7' : 'transparent',
            border: cell.isHovered && !cell.isEmpty ? '1px solid #E5E7EB' : '1px solid transparent'
          }}
        >
          <Typography component="span" sx={{ fontSize: 8.5, lineHeight: 1 }}>
            {cell.label}
          </Typography>
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              mt: 0.2,
              backgroundColor: cell.isActive ? cell.color : 'transparent'
            }}
          />
        </Box>
      </Box>
    </Grid>
  );
}

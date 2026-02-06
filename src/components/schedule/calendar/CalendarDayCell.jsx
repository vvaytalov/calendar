import { Box, Button, Grid, Typography } from '@mui/material';

export function CalendarDayCell({ cell, onHover, onLeave, onChangeMode }) {
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
              onClick={() => onChangeMode?.(cell.date)}
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
              Ð˜Ð·Ð¼ÐµÐ½Ð¸Ñ‚ÑŒ Ñ€ÐµÐ¶Ð¸Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹
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
            color: cell.isEmpty ? 'transparent' : cell.color,
            backgroundColor: cell.isHovered ? '#DCFCE7' : 'transparent'
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

import { Box, Stack, Typography } from '@mui/material';

export function CalendarLegend({ items }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center">
      {items.map((item) => (
        <Box
          key={item.key}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 0.75,
            py: 0.35,
            borderRadius: '999px',
            backgroundColor: item.background,
            border: `1px solid ${item.border}`
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: item.color }} />
          <Typography sx={{ fontSize: 9.5, color: item.text, fontWeight: 600 }}>{item.label}</Typography>
        </Box>
      ))}
    </Stack>
  );
}

import { Box, Button, Stack, Typography } from '@mui/material';

const navItems = ['ÐŸÐŸÐš', 'ÐžÑ‚Ð²ÐµÑ‚ÑÑ‚Ð²ÐµÐ½Ð½Ñ‹Ðµ Ð»Ð¸Ñ†Ð°', 'ÐšÐ¾Ð½Ñ‚Ð°ÐºÑ‚Ñ‹', 'Ð ÐµÐ¶Ð¸Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹'];

export function HeaderBar({ canSubmit }) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      alignItems={{ xs: 'flex-start', md: 'center' }}
      spacing={1}
      sx={{
        py: 0.75,
        px: 1,
        borderRadius: '12px',
        border: '1px solid #E6E8EC',
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 10px 18px rgba(15, 23, 42, 0.04)'
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
        {navItems.map((item) => (
          <Typography
            key={item}
            sx={{
              fontSize: 11,
              color: item === 'Ð ÐµÐ¶Ð¸Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹' ? '#065F46' : '#6B7280',
              fontWeight: item === 'Ð ÐµÐ¶Ð¸Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹' ? 700 : 500,
              px: item === 'Ð ÐµÐ¶Ð¸Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹' ? 0.8 : 0,
              py: item === 'Ð ÐµÐ¶Ð¸Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹' ? 0.25 : 0,
              borderRadius: item === 'Ð ÐµÐ¶Ð¸Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹' ? '999px' : 0,
              backgroundColor: item === 'Ð ÐµÐ¶Ð¸Ð¼ Ñ€Ð°Ð±Ð¾Ñ‚Ñ‹' ? '#ECFDF3' : 'transparent'
            }}
          >
            {item}
          </Typography>
        ))}
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', border: '1px solid #FCA5A5' }} />
      </Stack>

      <Button
        size="small"
        variant="outlined"
        disabled={!canSubmit}
        sx={{
          ml: { md: 'auto' },
          fontSize: 10,
          px: 1.5,
          borderRadius: '999px',
          borderColor: '#86EFAC',
          color: '#16A34A',
          backgroundColor: '#ECFDF3',
          '&:hover': {
            borderColor: '#22C55E',
            backgroundColor: '#F0FDF4'
          }
        }}
      >
        ÐžÑ‚Ð¿Ñ€Ð°Ð²Ð¸Ñ‚ÑŒ Ð½Ð° ÑÐ¾Ð³Ð»Ð°ÑÐ¾Ð²Ð°Ð½Ð¸Ðµ
      </Button>
    </Stack>
  );
}

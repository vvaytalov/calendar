import { Box, Button, Stack, Typography } from '@mui/material';

const navItems = ['ППП', 'Ответственные лица', 'Контакты', 'Режим работы'];

interface HeaderBarProps {
  canSubmit: boolean;
}

export function HeaderBar({ canSubmit }: HeaderBarProps) {
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
              color: item === 'Режим работы' ? '#065F46' : '#6B7280',
              fontWeight: item === 'Режим работы' ? 700 : 500,
              px: item === 'Режим работы' ? 0.8 : 0,
              py: item === 'Режим работы' ? 0.25 : 0,
              borderRadius: item === 'Режим работы' ? '999px' : 0,
              backgroundColor: item === 'Режим работы' ? '#ECFDF3' : 'transparent'
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
        Отправить на согласование
      </Button>
    </Stack>
  );
}

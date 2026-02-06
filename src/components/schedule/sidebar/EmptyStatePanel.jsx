import { Button, Paper, Stack, Typography } from '@mui/material';
import { AddRounded } from '@mui/icons-material';
import { panelSx } from './styles';

export function EmptyStatePanel({ onCreate }) {
  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={1}>
        <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#F97316', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Режим работы не настроен</Typography>
        <Typography sx={{ fontSize: 11, color: '#6B7280' }}>Добавьте расписание вручную или загрузите готовый шаблон.</Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddRounded fontSize="small" />}
          sx={{
            alignSelf: 'flex-start',
            fontSize: 10,
            py: 0.5,
            px: 1.2,
            backgroundColor: '#22C55E',
            boxShadow: '0px 6px 12px rgba(34, 197, 94, 0.24)'
          }}
          onClick={onCreate}
        >
          Создать вручную
        </Button>
      </Stack>
    </Paper>
  );
}

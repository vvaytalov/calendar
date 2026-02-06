import { Button, Paper, Stack } from '@mui/material';
import { AddRounded } from '@mui/icons-material';
import { panelSx } from '../../../shared/ui/schedulePanelStyles';

interface ToolbarPanelProps {
  onCreateBase: () => void;
  onCreateSpecial: () => void;
  onClearAll: () => void;
}

export function ToolbarPanel({ onCreateBase, onCreateSpecial, onClearAll }: ToolbarPanelProps) {
  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack direction="row" spacing={0.75} alignItems="center">
        <Button
          variant="contained"
          size="small"
          startIcon={<AddRounded fontSize="small" />}
          sx={{
            fontSize: 10,
            backgroundColor: '#22C55E',
            px: 1.2,
            boxShadow: '0px 6px 12px rgba(34, 197, 94, 0.24)'
          }}
          onClick={onCreateBase}
        >
          Создать
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{ fontSize: 10, px: 1.2, borderColor: '#A7F3D0', color: '#059669' }}
          onClick={onCreateSpecial}
        >
          Создать +
        </Button>
        <Button size="small" sx={{ fontSize: 10, ml: 'auto' }} color="error" onClick={onClearAll}>
          Удалить все
        </Button>
      </Stack>
    </Paper>
  );
}

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { cardSx, panelSx, sectionTitleSx } from './styles';
import type { BaseCard } from '../../../application/schedule/types';

interface BaseCardsProps {
  items: BaseCard[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BaseCards({ items, onEdit, onDelete }: BaseCardsProps) {
  if (items.length === 0) return null;

  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.75}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22C55E' }} />
          <Typography sx={sectionTitleSx}>Основное расписание</Typography>
        </Stack>
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              sx={{
                color: '#D1D5DB',
                '&.Mui-checked': { color: '#22C55E' }
              }}
            />
          }
          label={<Typography sx={{ fontSize: 10, color: '#6B7280' }}>Выбрать все</Typography>}
        />
      </Stack>
      <Stack spacing={0.75}>
        {items.map((item) => (
          <Card key={item.id} variant="outlined" sx={{ ...cardSx, position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: 3,
                borderRadius: '12px 0 0 12px',
                backgroundColor: '#22C55E'
              }}
            />
            <CardContent sx={{ px: 1.25, py: 0.9, '&:last-child': { pb: 0.9 } }}>
              <Typography sx={{ fontWeight: 700, fontSize: 12 }}>{item.title}</Typography>
              <Typography sx={{ fontSize: 11, color: '#64748B' }}>{item.dateLabel}</Typography>
              <Typography sx={{ fontSize: 11, color: '#64748B' }}>{item.timeLabel}</Typography>
              <Stack direction="row" spacing={0.25} mt={0.5} flexWrap="wrap">
                {item.days.map((day) => (
                  <Chip
                    key={`${item.id}-${day}`}
                    size="small"
                    label={day}
                    sx={{ height: 18, fontSize: 10, backgroundColor: '#F0FDF4' }}
                  />
                ))}
              </Stack>
            </CardContent>
            <CardActions sx={{ px: 1.25, py: 0.5 }}>
              <Button
                size="small"
                startIcon={<EditOutlined fontSize="small" />}
                onClick={() => onEdit(item.id)}
                sx={{ color: '#16A34A' }}
              >
                Изменить
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={<DeleteOutline fontSize="small" />}
                onClick={() => onDelete(item.id)}
              >
                Удалить
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Paper>
  );
}

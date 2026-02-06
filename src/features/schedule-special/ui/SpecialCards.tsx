import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { cardSx, panelSx, sectionTitleSx } from '../../../shared/ui/schedulePanelStyles';
import type { SpecialCard } from '../../schedule-management/model/types';

interface SpecialCardsProps {
  items: SpecialCard[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SpecialCards({ items, onEdit, onDelete }: SpecialCardsProps) {
  if (items.length === 0) return null;

  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack direction="row" spacing={0.5} alignItems="center" mb={0.75}>
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
        <Typography sx={sectionTitleSx}>Специальное расписание</Typography>
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
                backgroundColor: '#F59E0B'
              }}
            />
            <CardContent sx={{ px: 1.25, py: 0.9, '&:last-child': { pb: 0.9 } }}>
              <Typography sx={{ fontWeight: 700, fontSize: 12 }}>{item.title}</Typography>
              <Typography sx={{ fontSize: 11, color: '#64748B' }}>{item.dateLabel}</Typography>
              <Typography sx={{ fontSize: 11, color: '#64748B' }}>{item.daysLabel}</Typography>
              <Typography sx={{ fontSize: 11, color: '#64748B' }}>{item.timeLabel}</Typography>
              <Typography sx={{ fontSize: 11, color: '#9CA3AF' }}>{item.reasonLabel}</Typography>
            </CardContent>
            <CardActions sx={{ px: 1.25, py: 0.5 }}>
              <Button
                size="small"
                startIcon={<EditOutlined fontSize="small" />}
                onClick={() => onEdit(item.id)}
                sx={{ color: '#D97706' }}
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

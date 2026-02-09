import {
  Box,
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { cardSx, panelSx } from '../../../shared/ui/schedulePanelStyles';
import type { SpecialCard } from '../../schedule-management/model/types';

interface SpecialCardsProps {
  items: SpecialCard[];
  selectedIds: string[];
  isEditDisabled: boolean;
  isActionsDisabled: boolean;
  onToggle: (ids: string[]) => void;
  onEdit: (ids: string[]) => void;
  onDelete: (ids: string[]) => void;
}

export function SpecialCards({
  items,
  selectedIds,
  isEditDisabled,
  isActionsDisabled,
  onToggle,
  onEdit,
  onDelete
}: SpecialCardsProps) {
  if (items.length === 0) return null;

  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [uniformHeight, setUniformHeight] = useState<number | undefined>(undefined);

  const measureHeights = useCallback(() => {
    const heights = cardRefs.current.map((card) =>
      card ? Math.ceil(card.getBoundingClientRect().height) : 0
    );
    const maxHeight = heights.length ? Math.max(...heights) : 0;
    setUniformHeight(maxHeight || undefined);
  }, []);

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      measureHeights();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [items, measureHeights]);

  useEffect(() => {
    const handleResize = () => measureHeights();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measureHeights]);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(() => {
      measureHeights();
    });

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [items, measureHeights]);

  return (
    <Paper elevation={0} sx={panelSx}>
      <Card
        variant="outlined"
        sx={{
          ...cardSx,
          boxShadow: 'none',
          borderColor: '#E5E7EB'
        }}
      >
        <CardContent sx={{ px: 1.25, py: 1, '&:last-child': { pb: 1 } }}>
          <Stack spacing={0.75}>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Box sx={{ width: 2, height: 16, borderRadius: '2px', backgroundColor: '#F59E0B' }} />
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#F59E0B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                Специальное расписание
              </Typography>
            </Stack>
            {items.map((item, index) => {
              const selectedCount = item.ids.filter((id) => selectedIds.includes(id)).length;
              const isChecked = selectedCount === item.ids.length && item.ids.length > 0;
              const isIndeterminate = selectedCount > 0 && !isChecked;
              return (
                <Box
                  key={item.id}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    alignItems: 'start',
                    gap: 1,
                    py: 0.5,
                    borderTop: index === 0 ? 'none' : '1px solid #F1F5F9'
                  }}
                >
                  <Checkbox
                    size="small"
                    checked={isChecked}
                    indeterminate={isIndeterminate}
                    onChange={() => onToggle(item.ids)}
                    sx={{
                      mt: 0.2,
                      color: '#D1D5DB',
                      '&.Mui-checked': { color: '#F59E0B' }
                    }}
                  />
                  <Stack spacing={0.2}>
                    <Typography sx={{ fontSize: 11, color: '#6B7280' }}>
                      {item.dateLabel}
                    </Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#F59E0B' }}>
                      {item.timeLabel}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.25} alignItems="center">
                    <IconButton
                      size="small"
                      disabled={isEditDisabled || isActionsDisabled}
                      onClick={() => onEdit(item.ids)}
                    >
                      <EditOutlined
                        sx={{
                          fontSize: 18,
                          color: isEditDisabled || isActionsDisabled ? '#D1D5DB' : '#9CA3AF'
                        }}
                      />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={isActionsDisabled}
                      onClick={() => onDelete(item.ids)}
                    >
                      <DeleteOutline
                        sx={{ fontSize: 18, color: isActionsDisabled ? '#D1D5DB' : '#9CA3AF' }}
                      />
                    </IconButton>
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </Paper>
  );
}

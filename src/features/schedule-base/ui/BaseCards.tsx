import { Box, Card, CardContent, Checkbox, IconButton, Paper, Stack, Typography } from '@mui/material';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { cardSx, panelSx } from '../../../shared/ui/schedulePanelStyles';
import type { BaseCard } from '../../schedule-management/model/types';

interface BaseCardsProps {
  items: BaseCard[];
  selectedIds: string[];
  isEditDisabled: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BaseCards({
  items,
  selectedIds,
  isEditDisabled,
  onToggle,
  onEdit,
  onDelete
}: BaseCardsProps) {
  if (items.length === 0) return null;

  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [uniformHeight, setUniformHeight] = useState<number | undefined>(undefined);
  const shouldCombine = items.length === 2;

  const getDaysLabel = (days: string[]) => {
    const normalized = days.map((day) => day.toLowerCase());
    const isWeekdays =
      normalized.length === 5 &&
      ['пн', 'вт', 'ср', 'чт', 'пт'].every((day) => normalized.includes(day));
    if (isWeekdays) return 'пн-пт';
    const isWeekend = normalized.length === 2 && ['сб', 'вс'].every((day) => normalized.includes(day));
    if (isWeekend) return 'сб,вс';
    return normalized.join(',');
  };

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
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: '#22C55E',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          mb: 0.75
        }}
      >
        Основное расписание
      </Typography>

      <Stack spacing={0.75}>
        {shouldCombine ? (
          <Card
            ref={(node) => {
              cardRefs.current[0] = node;
            }}
            variant="outlined"
            sx={{
              ...cardSx,
              minHeight: uniformHeight ? `${uniformHeight}px` : undefined,
              boxShadow: 'none',
              borderColor: '#E5E7EB'
            }}
          >
            <CardContent sx={{ px: 1.25, py: 1, '&:last-child': { pb: 1 } }}>
              <Stack spacing={0.75}>
                {items.map((item) => (
                  <Stack
                    key={item.id}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <Stack direction="row" spacing={0.75} alignItems="flex-start" flex={1}>
                      <Checkbox
                        size="small"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => onToggle(item.id)}
                        sx={{
                          mt: 0.2,
                          color: '#D1D5DB',
                          '&.Mui-checked': { color: '#22C55E' }
                        }}
                      />
                      <Stack spacing={0.2}>
                        <Typography sx={{ fontSize: 11, color: '#6B7280' }}>
                          {item.dateLabel}{' '}
                          <Box component="span" sx={{ color: '#22C55E', fontWeight: 600 }}>
                            {item.title} ({getDaysLabel(item.days)})
                          </Box>
                        </Typography>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#22C55E' }}>
                          {item.timeLabel}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={0.25} alignItems="center">
                      <IconButton
                        size="small"
                        disabled={isEditDisabled}
                        onClick={() => onEdit(item.id)}
                      >
                        <EditOutlined
                          sx={{ fontSize: 18, color: isEditDisabled ? '#D1D5DB' : '#9CA3AF' }}
                        />
                      </IconButton>
                      <IconButton size="small" onClick={() => onDelete(item.id)}>
                        <DeleteOutline sx={{ fontSize: 18, color: '#9CA3AF' }} />
                      </IconButton>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        ) : (
          items.map((item, index) => (
            <Card
              key={item.id}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              variant="outlined"
              sx={{
                ...cardSx,
                minHeight: uniformHeight ? `${uniformHeight}px` : undefined,
                boxShadow: 'none',
                borderColor: '#E5E7EB'
              }}
            >
              <CardContent sx={{ px: 1.25, py: 1, '&:last-child': { pb: 1 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
                  <Stack direction="row" spacing={0.75} alignItems="flex-start" flex={1}>
                    <Checkbox
                      size="small"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => onToggle(item.id)}
                      sx={{
                        mt: 0.2,
                        color: '#D1D5DB',
                        '&.Mui-checked': { color: '#22C55E' }
                      }}
                    />
                    <Stack spacing={0.2}>
                      <Typography sx={{ fontSize: 11, color: '#6B7280' }}>
                        {item.dateLabel}{' '}
                        <Box component="span" sx={{ color: '#22C55E', fontWeight: 600 }}>
                          {item.title} ({getDaysLabel(item.days)})
                        </Box>
                      </Typography>
                      <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#22C55E' }}>
                        {item.timeLabel}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" spacing={0.25} alignItems="center">
                    <IconButton
                      size="small"
                      disabled={isEditDisabled}
                      onClick={() => onEdit(item.id)}
                    >
                      <EditOutlined
                        sx={{ fontSize: 18, color: isEditDisabled ? '#D1D5DB' : '#9CA3AF' }}
                      />
                    </IconButton>
                    <IconButton size="small" onClick={() => onDelete(item.id)}>
                      <DeleteOutline sx={{ fontSize: 18, color: '#9CA3AF' }} />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Paper>
  );
}
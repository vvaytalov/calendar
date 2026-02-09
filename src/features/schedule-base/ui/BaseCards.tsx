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
import type { BaseCard } from '../../schedule-management/model/types';

interface BaseCardsProps {
  items: BaseCard[];
  selectedIds: string[];
  isEditDisabled: boolean;
  isActionsDisabled: boolean;
  onToggle: (ids: string[]) => void;
  onEdit: (card: BaseCard) => void;
  onDelete: (ids: string[]) => void;
}

export function BaseCards({
  items,
  selectedIds,
  isEditDisabled,
  isActionsDisabled,
  onToggle,
  onEdit,
  onDelete
}: BaseCardsProps) {
  if (items.length === 0) return null;

  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [uniformHeight, setUniformHeight] = useState<number | undefined>(undefined);
  const shouldCombine = items.length === 2;

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
                {items.map((item) => {
                  const selectedCount = item.ids.filter((id) => selectedIds.includes(id)).length;
                  const isChecked = selectedCount === item.ids.length && item.ids.length > 0;
                  const isIndeterminate = selectedCount > 0 && !isChecked;
                  return (
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
                          checked={isChecked}
                          indeterminate={isIndeterminate}
                          onChange={() => onToggle(item.ids)}
                          sx={{
                            mt: 0.2,
                            color: '#D1D5DB',
                            '&.Mui-checked': { color: '#22C55E' }
                          }}
                        />
                        <Stack spacing={0.2}>
                          <Typography sx={{ fontSize: 11, color: '#6B7280' }}>
                            {item.daysLabel}
                          </Typography>
                          <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#22C55E' }}>
                            {item.timeLabel}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Stack direction="row" spacing={0.25} alignItems="center">
                        <IconButton
                          size="small"
                          disabled={isEditDisabled || isActionsDisabled}
                          onClick={() => onEdit(item)}
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
                    </Stack>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        ) : (
          items.map((item, index) => {
            const selectedCount = item.ids.filter((id) => selectedIds.includes(id)).length;
            const isChecked = selectedCount === item.ids.length && item.ids.length > 0;
            const isIndeterminate = selectedCount > 0 && !isChecked;
            return (
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
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={1}
                  >
                    <Stack direction="row" spacing={0.75} alignItems="flex-start" flex={1}>
                      <Checkbox
                        size="small"
                        checked={isChecked}
                        indeterminate={isIndeterminate}
                        onChange={() => onToggle(item.ids)}
                        sx={{
                          mt: 0.2,
                          color: '#D1D5DB',
                          '&.Mui-checked': { color: '#22C55E' }
                        }}
                      />
                      <Stack spacing={0.2}>
                        <Typography sx={{ fontSize: 11, color: '#6B7280' }}>
                          {item.daysLabel}
                        </Typography>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#22C55E' }}>
                          {item.timeLabel}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={0.25} alignItems="center">
                      <IconButton
                        size="small"
                        disabled={isEditDisabled || isActionsDisabled}
                        onClick={() => onEdit(item)}
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
                  </Stack>
                </CardContent>
              </Card>
            );
          })
        )}
      </Stack>
    </Paper>
  );
}

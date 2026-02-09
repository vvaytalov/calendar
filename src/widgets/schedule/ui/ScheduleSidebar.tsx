import { observer } from 'mobx-react-lite';
import {
  Alert,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { WarningAmberRounded } from '@mui/icons-material';
import { BaseForm } from '../../../features/schedule-base/ui/BaseForm';
import { SpecialForm } from '../../../features/schedule-special/ui/SpecialForm';
import { BaseCards } from '../../../features/schedule-base/ui/BaseCards';
import { SpecialCards } from '../../../features/schedule-special/ui/SpecialCards';
import { EmptyStatePanel } from '../../../features/schedule-empty/ui/EmptyStatePanel';
import { ToolbarPanel } from '../../../features/schedule-toolbar/ui/ToolbarPanel';
import { ScheduleSidebarSkeleton } from './ScheduleSidebarSkeleton';
import { panelSx } from '../../../shared/ui/schedulePanelStyles';
import { scheduleFieldSx } from '../../../shared/ui/scheduleFieldSx';
import type { SchedulePageStore } from '../../../features/schedule-management/model/SchedulePageStore';

interface ScheduleSidebarProps {
  store: SchedulePageStore;
}

export const ScheduleSidebar = observer(({ store }: ScheduleSidebarProps) => {
  const showTypeSelector = !store.editing && store.panelMode !== 'none';
  const scheduleTypeValue = store.panelMode === 'special-form' ? 'special' : 'base';

  return (
    <Stack spacing={1}>
      {store.notice && (
        <Alert
          icon={false}
          severity="success"
          sx={{
            py: 0.4,
            borderRadius: '10px',
            border: '1px solid #D1FAE5',
            backgroundColor: '#ECFDF3',
            '& .MuiAlert-message': { fontSize: 11, fontWeight: 700, color: '#065F46' }
          }}
        >
          {store.notice}
        </Alert>
      )}

      {store.hasConflicts && (
        <Alert
          icon={<WarningAmberRounded fontSize="small" />}
          severity="error"
          sx={{
            py: 0.35,
            borderRadius: '10px',
            border: '1px solid #FECACA',
            backgroundColor: '#FEF2F2',
            '& .MuiAlert-message': { fontSize: 11 }
          }}
        >
          Найдены пересекающиеся специальные интервалы с одинаковым приоритетом.
        </Alert>
      )}

      {!store.loading && !store.hasAnySchedules && store.panelMode === 'none' && (
        <EmptyStatePanel onCreate={store.startCreate} />
      )}

      {!store.loading && store.hasAnySchedules && store.panelMode === 'none' && (
        <ToolbarPanel onCreate={store.startCreate} onClearAll={store.clearAll} />
      )}

      {showTypeSelector && (
        <Paper elevation={0} sx={panelSx}>
          <FormControl size="small" sx={scheduleFieldSx} fullWidth>
            <InputLabel>Тип расписания</InputLabel>
            <Select
              value={scheduleTypeValue}
              label="Тип расписания"
              onChange={(e) => {
                const next = e.target.value as 'base' | 'special';
                if (next === 'base') {
                  store.startCreateBase();
                } else {
                  store.startCreateSpecial();
                }
              }}
            >
              <MenuItem value="base">Основное расписание</MenuItem>
              <MenuItem value="special">Специальное расписание</MenuItem>
            </Select>
          </FormControl>
        </Paper>
      )}

      {store.panelMode === 'base-form' && (
        <BaseForm
          baseForm={store.baseForm}
          onChange={store.updateBaseForm}
          onToggleWeekday={store.toggleWeekdayDay}
          onToggleWeekend={store.toggleWeekendDay}
          onCancel={store.resetEditing}
          onSave={store.saveBase}
        />
      )}

      {store.panelMode === 'special-form' && (
        <SpecialForm
          specialForm={store.specialForm}
          editingKind={store.editing?.kind}
          onChange={store.updateSpecialForm}
          onCancel={store.resetEditing}
          onSave={store.saveSpecial}
        />
      )}

      {store.loading && <ScheduleSidebarSkeleton />}

      {!store.loading && store.hasAnySchedules && (
        <Paper elevation={0} sx={panelSx}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={store.allSelected}
                  indeterminate={store.someSelected}
                  onChange={store.toggleAllSelections}
                  sx={{
                    color: '#D1D5DB',
                    '&.Mui-checked': { color: '#22C55E' }
                  }}
                />
              }
              label={<Typography sx={{ fontSize: 11, color: '#16A34A' }}>Выбрать все</Typography>}
            />
            <Button
              size="small"
              color="error"
              disabled={store.selectedCount === 0}
              sx={{ fontSize: 10, textTransform: 'none' }}
              onClick={store.deleteSelected}
            >
              Удалить выбранные
            </Button>
          </Stack>
        </Paper>
      )}

      {!store.loading && (
        <>
          <BaseCards
            items={store.baseCards}
            selectedIds={store.selectedBaseIds}
            isEditDisabled={store.isMultiSelect}
            isActionsDisabled={store.allSelected}
            onToggle={store.toggleBaseSelection}
            onEdit={store.editBaseCard}
            onDelete={store.deleteBase}
          />
          <SpecialCards
            items={store.specialCards}
            selectedIds={store.selectedSpecialIds}
            isEditDisabled={store.isMultiSelect}
            isActionsDisabled={store.allSelected}
            onToggle={store.toggleSpecialSelection}
            onEdit={store.editSpecialByIds}
            onDelete={store.deleteSpecial}
          />
        </>
      )}

      {store.loading && (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={16} />
          <Typography sx={{ fontSize: 11 }}>Загрузка...</Typography>
        </Stack>
      )}
    </Stack>
  );
});

import { observer } from 'mobx-react-lite';
import { Alert, CircularProgress, Stack, Typography } from '@mui/material';
import { WarningAmberRounded } from '@mui/icons-material';
import { BaseForm } from '../../../features/schedule-base/ui/BaseForm';
import { SpecialForm } from '../../../features/schedule-special/ui/SpecialForm';
import { BaseCards } from '../../../features/schedule-base/ui/BaseCards';
import { SpecialCards } from '../../../features/schedule-special/ui/SpecialCards';
import { EmptyStatePanel } from '../../../features/schedule-empty/ui/EmptyStatePanel';
import { ToolbarPanel } from '../../../features/schedule-toolbar/ui/ToolbarPanel';
import type { SchedulePageStore } from '../../../features/schedule-management/model/SchedulePageStore';

interface ScheduleSidebarProps {
  store: SchedulePageStore;
}

export const ScheduleSidebar = observer(({ store }: ScheduleSidebarProps) => {
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

      {!store.hasAnySchedules && store.panelMode === 'none' && (
        <EmptyStatePanel onCreate={store.startCreateBase} />
      )}

      {store.hasAnySchedules && store.panelMode === 'none' && (
        <ToolbarPanel
          onCreateBase={store.startCreateBase}
          onCreateSpecial={store.startCreateSpecial}
          onClearAll={store.clearAll}
        />
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

      <BaseCards items={store.baseCards} onEdit={store.editBaseById} onDelete={store.deleteBase} />
      <SpecialCards
        items={store.specialCards}
        onEdit={store.editSpecialById}
        onDelete={store.deleteSpecial}
      />

      {store.loading && (
        <Stack direction="row" spacing={1} alignItems="center">
          <CircularProgress size={16} />
          <Typography sx={{ fontSize: 11 }}>Загрузка...</Typography>
        </Stack>
      )}
    </Stack>
  );
});

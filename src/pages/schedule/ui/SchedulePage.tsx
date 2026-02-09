import { observer } from 'mobx-react-lite';
import { Alert, Box, Container, Grid, Paper, Stack } from '@mui/material';
import { HeaderBar } from '../../../widgets/schedule/ui/HeaderBar';
import { ScheduleSidebar } from '../../../widgets/schedule/ui/ScheduleSidebar';
import { YearCalendar } from '../../../widgets/schedule/ui/YearCalendar';
import { ConfirmDialog } from '../../../widgets/schedule/ui/ConfirmDialog';
import type { SchedulePageStore } from '../../../features/schedule-management/model/SchedulePageStore';

interface SchedulePageProps {
  store: SchedulePageStore;
}

export const SchedulePage = observer(({ store }: SchedulePageProps) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: 1.5,
        background: 'linear-gradient(180deg, #F8FAFC 0%, #F3F4F6 45%, #F8FAFC 100%)'
      }}
    >
      <Container maxWidth="xl" sx={{ px: { xs: 1, md: 1.5 } }}>
        <Stack spacing={1.25}>
          <HeaderBar canSubmit={store.hasAnySchedules} />

          {store.error && <Alert severity="error">{store.error}</Alert>}

          <Grid container spacing={1}>
            <Grid item xs={12} md={3.3} lg={2.9}>
              <ScheduleSidebar store={store} />
            </Grid>

            <Grid item xs={12} md={8.7} lg={9.1}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.25,
                  borderRadius: '12px',
                  border: '1px solid #E6E8EC',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0px 14px 24px rgba(15, 23, 42, 0.05)'
                }}
              >
                <YearCalendar store={store} />
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>

      <ConfirmDialog
        open={store.confirmState.open}
        title={store.confirmState.title}
        description={store.confirmState.description}
        confirmLabel={store.confirmState.confirmLabel}
        details={store.confirmState.details}
        reasonLabel={store.confirmState.reasonLabel}
        reasonPlaceholder={store.confirmState.reasonPlaceholder}
        onClose={store.closeConfirm}
        onConfirm={store.confirmAction}
      />
    </Box>
  );
});

import { Paper, Skeleton, Stack } from '@mui/material';
import { panelSx } from '../../../shared/ui/schedulePanelStyles';

export function ScheduleSidebarSkeleton() {
  return (
    <Paper elevation={0} sx={panelSx}>
      <Stack spacing={0.75}>
        <Skeleton variant="text" width="60%" height={16} />
        <Stack spacing={0.6}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Stack
              key={`schedule-skel-${index}`}
              direction="row"
              spacing={0.75}
              alignItems="center"
            >
              <Skeleton variant="rounded" width={18} height={18} />
              <Stack spacing={0.35} flex={1}>
                <Skeleton variant="text" width="90%" height={14} />
                <Skeleton variant="text" width="50%" height={12} />
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}

import Alert from '@mui/material/Alert';

interface ConflictBannerProps {
  hasConflicts: boolean;
}

export function ConflictBanner({ hasConflicts }: ConflictBannerProps) {
  if (!hasConflicts) return null;

  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      Есть конфликт специальных интервалов с одинаковым приоритетом.
    </Alert>
  );
}

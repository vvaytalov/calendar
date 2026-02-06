import Alert from '@mui/material/Alert';

export function ConflictBanner({ hasConflicts }) {
  if (!hasConflicts) return null;

  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      Есть конфликт специальных интервалов с одинаковым приоритетом.
    </Alert>
  );
}

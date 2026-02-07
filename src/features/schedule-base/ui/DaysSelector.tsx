import { Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';
import { DAY_OPTIONS } from '../../../shared/config/calendarConstants';
import type { DayNumber } from '../../../entities/schedule/model/types';

interface DaysSelectorProps {
  label: string;
  value: DayNumber[];
  onToggle: (day: DayNumber) => void;
}

export function DaysSelector({ label, value, onToggle }: DaysSelectorProps) {
  return (
    <Stack spacing={0.5}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>{label}</Typography>
      <Stack direction="row" spacing={0.25} flexWrap="wrap" rowGap={0.5}>
        {DAY_OPTIONS.map((day) => (
          <FormControlLabel
            key={`${label}-${day.value}`}
            sx={{
              mr: 0.5,
              ml: 0,
              '& .MuiFormControlLabel-label': {
                fontSize: 12,
                fontWeight: 600,
                color: '#374151'
              }
            }}
            control={
              <Checkbox
                size="small"
                checked={value.includes(day.value)}
                onChange={() => onToggle(day.value)}
                sx={{
                  color: '#D1D5DB',
                  '&.Mui-checked': { color: '#22C55E' }
                }}
              />
            }
            label={day.label}
          />
        ))}
      </Stack>
    </Stack>
  );
}

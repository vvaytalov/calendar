import type { SxProps, Theme } from '@mui/material/styles';

export const scheduleFieldSx: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#FFFFFF',
    fontSize: 12
  },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
  '& .MuiInputLabel-root': { fontSize: 11, color: '#6B7280' },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#22C55E'
  }
};

import type { SxProps, Theme } from '@mui/material';

export const panelSx: SxProps<Theme> = {
  p: 2,
  borderRadius: '12px',
  border: '1px solid #E5E7EB',
  boxShadow: '0px 8px 18px rgba(15, 23, 42, 0.06)',
  backgroundColor: '#FFFFFF'
};

export const sectionTitleSx: SxProps<Theme> = {
  fontSize: 11,
  fontWeight: 700,
  color: '#111827',
  textTransform: 'uppercase',
  letterSpacing: '0.04em'
};

export const cardSx: SxProps<Theme> = {
  borderRadius: '12px',
  borderColor: '#E6E8EC',
  backgroundColor: '#FFFFFF',
  boxShadow: '0px 6px 12px rgba(15, 23, 42, 0.04)',
  display: 'flex',
  flexDirection: 'column'
};

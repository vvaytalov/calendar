import { Button, Stack, TextField, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';

interface FormTitleProps {
  children: ReactNode;
}

export function FormTitle({ children }: FormTitleProps) {
  return (
    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{children}</Typography>
  );
}

interface FieldLabelProps {
  children: ReactNode;
}

export function FieldLabel({ children }: FieldLabelProps) {
  return (
    <Typography sx={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>{children}</Typography>
  );
}

interface DateRangeFieldsProps {
  fromLabel: string;
  toLabel: string;
  fromValue: string;
  toValue: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  fieldSx: SxProps<Theme>;
}

export function DateRangeFields({
  fromLabel,
  toLabel,
  fromValue,
  toValue,
  onChangeFrom,
  onChangeTo,
  fieldSx
}: DateRangeFieldsProps) {
  return (
    <Stack direction="row" spacing={0.75}>
      <TextField
        label={fromLabel}
        type="date"
        size="small"
        InputLabelProps={{ shrink: true }}
        value={fromValue}
        onChange={(e) => onChangeFrom(e.target.value)}
        sx={fieldSx}
        fullWidth
      />
      <TextField
        label={toLabel}
        type="date"
        size="small"
        InputLabelProps={{ shrink: true }}
        value={toValue}
        onChange={(e) => onChangeTo(e.target.value)}
        sx={fieldSx}
        fullWidth
      />
    </Stack>
  );
}

interface TimeRangeFieldsProps {
  fromLabel: string;
  toLabel: string;
  fromValue: string;
  toValue: string;
  onChangeFrom: (value: string) => void;
  onChangeTo: (value: string) => void;
  fieldSx: SxProps<Theme>;
}

export function TimeRangeFields({
  fromLabel,
  toLabel,
  fromValue,
  toValue,
  onChangeFrom,
  onChangeTo,
  fieldSx
}: TimeRangeFieldsProps) {
  return (
    <Stack direction="row" spacing={0.75}>
      <TextField
        label={fromLabel}
        type="time"
        size="small"
        InputLabelProps={{ shrink: true }}
        value={fromValue}
        onChange={(e) => onChangeFrom(e.target.value)}
        sx={fieldSx}
        fullWidth
      />
      <TextField
        label={toLabel}
        type="time"
        size="small"
        InputLabelProps={{ shrink: true }}
        value={toValue}
        onChange={(e) => onChangeTo(e.target.value)}
        sx={fieldSx}
        fullWidth
      />
    </Stack>
  );
}

interface FormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  disableSave: boolean;
  saveLabel?: string;
}

export function FormActions({
  onCancel,
  onSave,
  disableSave,
  saveLabel = 'Сохранить'
}: FormActionsProps) {
  return (
    <Stack direction="row" justifyContent="flex-end" spacing={0.75}>
      <Button size="small" variant="text" sx={{ color: '#6B7280' }} onClick={onCancel}>
        Отмена
      </Button>
      <Button
        size="small"
        variant="contained"
        disabled={disableSave}
        sx={{
          borderRadius: '8px',
          backgroundColor: '#22C55E',
          boxShadow: '0px 6px 12px rgba(34, 197, 94, 0.24)',
          '&:hover': { backgroundColor: '#16A34A' }
        }}
        onClick={onSave}
      >
        {saveLabel}
      </Button>
    </Stack>
  );
}

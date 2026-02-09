import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  details?: {
    base: string[];
    special: string[];
  };
  reasonLabel?: string;
  reasonPlaceholder?: string;
  onClose: () => void;
  onConfirm: (reason?: string) => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  details,
  reasonLabel,
  reasonPlaceholder,
  onClose,
  onConfirm
}: ConfirmDialogProps) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!open) return;
    setReason('');
  }, [open]);

  const hasDetails = !!details && (details.base.length > 0 || details.special.length > 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: '16px', p: 0.75 } }}
    >
      <DialogTitle sx={{ fontSize: 15, fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={1.25}>
          <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{description}</Typography>

          {hasDetails && (
            <Box
              sx={{
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#F8FAFC',
                p: 1
              }}
            >
              <Stack spacing={1}>
                {details.base.length > 0 && (
                  <Stack spacing={0.5}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>
                      Основное расписание
                    </Typography>
                    <Stack spacing={0.35}>
                      {details.base.map((line) => (
                        <Typography key={line} sx={{ fontSize: 11, color: '#4B5563' }}>
                          {line}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                )}

                {details.special.length > 0 && (
                  <Stack spacing={0.5}>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>
                      Специальное расписание
                    </Typography>
                    <Stack spacing={0.35}>
                      {details.special.map((line) => (
                        <Typography key={line} sx={{ fontSize: 11, color: '#4B5563' }}>
                          {line}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Box>
          )}

          {reasonLabel && (
            <TextField
              label={reasonLabel}
              placeholder={reasonPlaceholder}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              multiline
              minRows={3}
              fullWidth
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  fontSize: 12
                },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E5E7EB' },
                '& .MuiInputLabel-root': { fontSize: 11, color: '#6B7280' }
              }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 1.5 }}>
        <Button size="small" variant="outlined" color="inherit" onClick={onClose}>
          Отмена
        </Button>
        <Button size="small" variant="contained" color="error" onClick={() => onConfirm(reason)}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
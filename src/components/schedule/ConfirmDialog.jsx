import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography
} from '@mui/material';

export function ConfirmDialog({ open, title, description, confirmLabel, onClose, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: '12px', p: 0.5 } }}
    >
      <DialogTitle sx={{ fontSize: 14, fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: 12, color: '#6B7280' }}>{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 2, pb: 1.5 }}>
        <Button size="small" variant="outlined" color="inherit" onClick={onClose}>
          ÐžÑ‚Ð¼ÐµÐ½Ð°
        </Button>
        <Button size="small" variant="contained" color="error" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

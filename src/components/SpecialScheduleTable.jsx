import {
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

export function SpecialScheduleTable({ items, onEdit, onDelete }) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Период</TableCell>
            <TableCell>Приоритет</TableCell>
            <TableCell>Перекрытие</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                {new Date(item.dateFrom).toLocaleString()} - {new Date(item.dateTo).toLocaleString()}
              </TableCell>
              <TableCell>{item.priority}</TableCell>
              <TableCell>
                <Chip
                  size="small"
                  color={item.isOverrideBase ? 'warning' : 'default'}
                  label={item.isOverrideBase ? 'Да' : 'Нет'}
                />
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button size="small" variant="outlined" onClick={() => onEdit(item)}>
                    Редактировать
                  </Button>
                  <Button size="small" color="error" variant="contained" onClick={() => onDelete(item.id)}>
                    Удалить
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

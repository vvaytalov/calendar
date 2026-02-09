import {
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import type { TimeTableEntry } from '../../../entities/schedule/model/types';
import { formatDate } from '../../../shared/lib/dateFormat';

interface SpecialScheduleTableProps {
  items: TimeTableEntry[];
  onEdit: (item: TimeTableEntry) => void;
  onDelete: (id: string) => void;
}

export function SpecialScheduleTable({ items, onEdit, onDelete }: SpecialScheduleTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Дата</TableCell>
            <TableCell>Время</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{item.date ? formatDate(item.date) : '-'}</TableCell>
              <TableCell>
                {item.openTime} - {item.closeTime}
              </TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button size="small" variant="outlined" onClick={() => onEdit(item)}>
                    Редактировать
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    onClick={() => onDelete(item.id)}
                  >
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

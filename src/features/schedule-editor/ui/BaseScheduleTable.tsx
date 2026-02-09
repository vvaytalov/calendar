import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Stack,
  Button
} from '@mui/material';
import type { DayNumber, TimeTableEntry } from '../../../entities/schedule/model/types';
import { DAY_LABEL } from '../../../shared/config/calendarConstants';
import { formatDate } from '../../../shared/lib/dateFormat';

const dayLabels: Record<DayNumber, string> = DAY_LABEL;

interface BaseScheduleTableProps {
  items: TimeTableEntry[];
  onEdit: (item: TimeTableEntry) => void;
  onDelete: (id: string) => void;
}

const formatDay = (item: TimeTableEntry): string => {
  if (item.date) return formatDate(item.date);
  if (item.day) return dayLabels[item.day] || String(item.day);
  return '-';
};

export function BaseScheduleTable({ items, onEdit, onDelete }: BaseScheduleTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>День</TableCell>
            <TableCell>Время</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{formatDay(item)}</TableCell>
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

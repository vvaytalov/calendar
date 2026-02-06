import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Stack,
  Chip,
  Button
} from '@mui/material';
import type { BaseSchedule, DayNumber } from '../domain/schedule/types';

const dayLabels: Record<DayNumber, string> = {
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб',
  7: 'Вс'
};

interface BaseScheduleTableProps {
  items: BaseSchedule[];
  onEdit: (item: BaseSchedule) => void;
  onDelete: (id: string) => void;
}

export function BaseScheduleTable({ items, onEdit, onDelete }: BaseScheduleTableProps) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Время</TableCell>
            <TableCell>Дни</TableCell>
            <TableCell align="right">Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                {item.timeFrom} - {item.timeTo}
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {item.daysOfWeek.map((day) => (
                    <Chip key={day} size="small" label={dayLabels[day] || day} />
                  ))}
                </Stack>
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

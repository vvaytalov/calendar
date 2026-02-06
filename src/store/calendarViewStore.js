import { makeAutoObservable } from 'mobx';
import { MONTHS, WEEKDAYS } from '../constants/schedule';
import { CALENDAR_COLORS } from '../constants/calendar';
import { dayNumber, inRange, isWeekend } from '../utils/calendar';

export class CalendarViewStore {
  year = new Date().getFullYear();
  hoveredKey = null;

  constructor(dataStore) {
    this.dataStore = dataStore;
    makeAutoObservable(this, { dataStore: false }, { autoBind: true });
  }

  setHoveredKey(key) {
    this.hoveredKey = key;
  }

  clearHoveredKey() {
    this.hoveredKey = null;
  }

  onHoverCell(cell) {
    if (cell?.dateKey) {
      this.hoveredKey = cell.dateKey;
    }
  }

  onLeaveCell(cell) {
    if (cell?.dateKey && this.hoveredKey === cell.dateKey) {
      this.hoveredKey = null;
    }
  }

  get months() {
    return MONTHS.map((month, monthIndex) => {
      const cells = this.getMonthCells(this.year, monthIndex).map((cell, index) =>
        this.toCellView(cell, `${month}-${index}`)
      );

      return {
        key: month,
        label: month,
        weekdays: WEEKDAYS,
        cells
      };
    });
  }

  get legendItems() {
    return [
      {
        key: 'weekday',
        label: 'Ð‘ÑƒÐ´Ð½Ð¸',
        color: CALENDAR_COLORS.weekday,
        border: '#D1FAE5',
        background: '#ECFDF3',
        text: '#065F46'
      },
      {
        key: 'weekend',
        label: 'Ð’Ñ‹Ñ…Ð¾Ð´Ð½Ñ‹Ðµ',
        color: CALENDAR_COLORS.weekend,
        border: '#D1FAE5',
        background: '#ECFDF3',
        text: '#065F46'
      },
      {
        key: 'special',
        label: 'Ð¡Ð¿ÐµÑ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ðµ',
        color: CALENDAR_COLORS.special,
        border: '#FDE68A',
        background: '#FFFBEB',
        text: '#92400E'
      }
    ];
  }

  toCellView(cell, key) {
    if (!cell) {
      return {
        key,
        isEmpty: true,
        label: '',
        date: null,
        dateKey: null,
        status: 'none',
        color: CALENDAR_COLORS.textMuted,
        isActive: false,
        isHovered: false
      };
    }

    const status = this.resolveDayStatus(
      cell,
      this.dataStore.baseSchedules,
      this.dataStore.specialSchedules
    );
    const isActive = status !== 'none';
    const color =
      status === 'special'
        ? CALENDAR_COLORS.special
        : status === 'weekend'
          ? CALENDAR_COLORS.weekend
          : status === 'weekday'
            ? CALENDAR_COLORS.weekday
            : CALENDAR_COLORS.textMuted;
    const dateKey = this.toDateKey(cell);

    return {
      key,
      isEmpty: false,
      label: String(cell.getDate()),
      date: cell,
      dateKey,
      status,
      color,
      isActive,
      isHovered: this.hoveredKey === dateKey
    };
  }

  resolveDayStatus(date, baseSchedules, specialSchedules) {
    const hasSpecial = specialSchedules.some((item) => inRange(date, item.dateFrom, item.dateTo));
    if (hasSpecial) return 'special';

    const day = dayNumber(date);
    const activeBase = baseSchedules.find(
      (item) => inRange(date, item.validFrom, item.validTo) && item.daysOfWeek.includes(day)
    );

    if (!activeBase) return 'none';
    return isWeekend(date) ? 'weekend' : 'weekday';
  }

  getMonthCells(year, monthIndex) {
    const monthStart = new Date(year, monthIndex, 1);
    const monthEnd = new Date(year, monthIndex + 1, 0);
    const daysInMonth = monthEnd.getDate();
    const firstWeekDay = (monthStart.getDay() + 6) % 7;

    const cells = [];
    for (let i = 0; i < firstWeekDay; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, monthIndex, day));

    return cells;
  }

  toDateKey(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${date.getFullYear()}-${month}-${day}`;
  }
}

import { makeAutoObservable } from 'mobx';
import { MONTHS, WEEKDAYS } from '../../../shared/config/calendarConstants';
import { CALENDAR_COLORS } from '../../../shared/config/calendarColors';
import {
  dayNumber,
  getMonthCells,
  inRange,
  isWeekend,
  toDateKey
} from '../../../entities/calendar/lib/utils';
import type { BaseSchedule, SpecialSchedule } from '../../../entities/schedule/model/types';
import type {
  CalendarCell,
  CalendarLegendItem,
  CalendarMonthView,
  CalendarStatus
} from '../../../entities/calendar/model/types';
import type { ZoneScheduleStore } from '../../../entities/schedule/model/ZoneScheduleStore';

export class CalendarViewStore {
  year = new Date().getFullYear();
  hoveredKey: string | null = null;
  dataStore: ZoneScheduleStore;

  constructor(dataStore: ZoneScheduleStore) {
    this.dataStore = dataStore;
    makeAutoObservable(this, { dataStore: false }, { autoBind: true });
  }

  setHoveredKey(key: string | null) {
    this.hoveredKey = key;
  }

  clearHoveredKey() {
    this.hoveredKey = null;
  }

  onHoverCell(cell?: CalendarCell | null) {
    if (cell?.dateKey) {
      this.hoveredKey = cell.dateKey;
    }
  }

  onLeaveCell(cell?: CalendarCell | null) {
    if (cell?.dateKey && this.hoveredKey === cell.dateKey) {
      this.hoveredKey = null;
    }
  }

  get months(): CalendarMonthView[] {
    return MONTHS.map((month, monthIndex) => {
      const cells = getMonthCells(this.year, monthIndex).map((cell, index) =>
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

  get legendItems(): CalendarLegendItem[] {
    return [
      {
        key: 'weekday',
        label: 'Будни',
        color: CALENDAR_COLORS.weekday,
        border: '#D1FAE5',
        background: '#ECFDF3',
        text: '#065F46'
      },
      {
        key: 'weekend',
        label: 'Выходные',
        color: CALENDAR_COLORS.weekend,
        border: '#D1FAE5',
        background: '#ECFDF3',
        text: '#065F46'
      },
      {
        key: 'special',
        label: 'Специальные',
        color: CALENDAR_COLORS.special,
        border: '#FDE68A',
        background: '#FFFBEB',
        text: '#92400E'
      }
    ];
  }

  private toCellView(cell: Date | null, key: string): CalendarCell {
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
    const dateKey = toDateKey(cell);

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

  private resolveDayStatus(
    date: Date,
    baseSchedules: BaseSchedule[],
    specialSchedules: SpecialSchedule[]
  ): CalendarStatus {
    const hasSpecial = specialSchedules.some((item) => inRange(date, item.dateFrom, item.dateTo));
    if (hasSpecial) return 'special';

    const day = dayNumber(date);
    const activeBase = baseSchedules.find(
      (item) => inRange(date, item.validFrom, item.validTo) && item.daysOfWeek.includes(day)
    );

    if (!activeBase) return 'none';
    return isWeekend(date) ? 'weekend' : 'weekday';
  }
}

export type CalendarStatus = 'none' | 'weekday' | 'weekend' | 'special';

export interface CalendarCell {
  key: string;
  isEmpty: boolean;
  label: string;
  date: Date | null;
  dateKey: string | null;
  status: CalendarStatus;
  color: string;
  isActive: boolean;
  isHovered: boolean;
}

export interface CalendarMonthView {
  key: string;
  label: string;
  weekdays: string[];
  cells: CalendarCell[];
}

export interface CalendarLegendItem {
  key: string;
  label: string;
  color: string;
  border: string;
  background: string;
  text: string;
}

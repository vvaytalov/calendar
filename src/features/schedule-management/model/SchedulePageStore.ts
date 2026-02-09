import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { CalendarViewStore } from './CalendarViewStore';
import { createBaseFormState, createSpecialFormState } from './formDefaults';
import { buildSpecialEntries, buildWorkEntries, toBaseCards, toSpecialCards } from './mappers';
import { toDateInput } from '../../../shared/lib/dateFormat';
import type {
  BaseCard,
  BaseFormState,
  ConfirmState,
  EditingState,
  SpecialCard,
  SpecialFormState
} from './types';
import type { DayNumber, TimeTableEntry } from '../../../entities/schedule/model/types';
import type { ZoneScheduleStore } from '../../../entities/schedule/model/ZoneScheduleStore';

export class SchedulePageStore {
  panelMode: 'none' | 'base-form' | 'special-form' = 'none';
  notice = '';
  baseForm: BaseFormState = createBaseFormState();
  specialForm: SpecialFormState = createSpecialFormState();
  editing: EditingState | null = null;
  confirmState: ConfirmState = {
    open: false,
    title: '',
    description: '',
    confirmLabel: 'Удалить',
    onConfirm: null
  };
  dataStore: ZoneScheduleStore;
  calendarStore: CalendarViewStore;
  selectedBaseIds: string[] = [];
  selectedSpecialIds: string[] = [];

  constructor(dataStore: ZoneScheduleStore) {
    this.dataStore = dataStore;
    this.calendarStore = new CalendarViewStore(this.dataStore);
    makeAutoObservable(this, { dataStore: false, calendarStore: false }, { autoBind: true });

    reaction(
      () => this.dataStore.zoneId,
      () => {
        this.dataStore.load();
      },
      { fireImmediately: true }
    );
  }

  get hasAnySchedules(): boolean {
    return this.dataStore.workTime.length > 0 || this.dataStore.specialTime.length > 0;
  }

  get hasBaseSchedules(): boolean {
    return this.dataStore.workTime.length > 0;
  }

  get loading(): boolean {
    return this.dataStore.loading || this.dataStore.saving;
  }

  get error(): string | null {
    return this.dataStore.error;
  }

  get hasConflicts(): boolean {
    return this.dataStore.hasConflicts;
  }

  get baseCards(): BaseCard[] {
    return toBaseCards(this.dataStore.workTime);
  }

  get specialCards(): SpecialCard[] {
    return toSpecialCards(this.dataStore.specialTime);
  }

  get selectedCount(): number {
    return this.selectedBaseIds.length + this.selectedSpecialIds.length;
  }

  get selectedCardCount(): number {
    const baseSelected = this.baseCards.filter((card) =>
      card.ids.every((id) => this.selectedBaseIds.includes(id))
    ).length;
    const specialSelected = this.specialCards.filter((card) =>
      card.ids.every((id) => this.selectedSpecialIds.includes(id))
    ).length;
    return baseSelected + specialSelected;
  }

  get allSelected(): boolean {
    const total = this.dataStore.workTime.length + this.dataStore.specialTime.length;
    return total > 0 && this.selectedCount === total;
  }

  get someSelected(): boolean {
    return this.selectedCount > 0 && !this.allSelected;
  }

  get isMultiSelect(): boolean {
    return this.selectedCardCount > 1;
  }

  updateBaseForm(patch: Partial<BaseFormState>) {
    this.baseForm = { ...this.baseForm, ...patch };
  }

  updateSpecialForm(patch: Partial<SpecialFormState>) {
    this.specialForm = { ...this.specialForm, ...patch };
  }

  toggleWeekdayDay(day: DayNumber) {
    this.baseForm = {
      ...this.baseForm,
      weekdayDays: this.toggleDay(this.baseForm.weekdayDays, day)
    };
  }

  toggleWeekendDay(day: DayNumber) {
    this.baseForm = {
      ...this.baseForm,
      weekendDays: this.toggleDay(this.baseForm.weekendDays, day)
    };
  }

  toggleBaseSelection(ids: string[]) {
    this.selectedBaseIds = this.toggleSelectionMany(this.selectedBaseIds, ids);
  }

  toggleSpecialSelection(ids: string[]) {
    this.selectedSpecialIds = this.toggleSelectionMany(this.selectedSpecialIds, ids);
  }

  toggleAllSelections() {
    if (this.allSelected) {
      this.selectedBaseIds = [];
      this.selectedSpecialIds = [];
      return;
    }

    this.selectedBaseIds = this.dataStore.workTime.map((item) => item.id);
    this.selectedSpecialIds = this.dataStore.specialTime.map((item) => item.id);
  }

  clearSelections() {
    this.selectedBaseIds = [];
    this.selectedSpecialIds = [];
  }

  private toggleDay(list: DayNumber[], day: DayNumber): DayNumber[] {
    return list.includes(day)
      ? list.filter((item) => item !== day)
      : [...list, day].sort((a, b) => a - b);
  }

  private toggleSelection(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
  }

  private toggleSelectionMany(list: string[], ids: string[]): string[] {
    const allSelected = ids.every((id) => list.includes(id));
    if (allSelected) return list.filter((item) => !ids.includes(item));
    const next = new Set(list);
    ids.forEach((id) => next.add(id));
    return Array.from(next);
  }

  resetEditing() {
    this.editing = null;
    this.panelMode = 'none';
  }

  startCreateBase() {
    this.notice = '';
    this.editing = null;
    this.baseForm = createBaseFormState();
    this.panelMode = 'base-form';
  }

  startCreateSpecial() {
    this.notice = '';
    this.editing = null;
    this.specialForm = createSpecialFormState();
    this.panelMode = 'special-form';
  }

  startCreate() {
    this.startCreateBase();
  }

  changeModeFromCalendar(date: Date) {
    this.notice = '';
    this.editing = null;
    this.specialForm = {
      ...this.specialForm,
      dateFrom: toDateInput(date),
      dateTo: toDateInput(date)
    };
    this.panelMode = 'special-form';
  }

  editBaseCard(card: BaseCard) {
    const items = this.dataStore.workTime.filter((base) => card.ids.includes(base.id));
    if (items.length === 0) return;

    const next = createBaseFormState();
    const first = items[0];
    next.weekdayTimeFrom = first.openTime;
    next.weekdayTimeTo = first.closeTime;
    next.weekendTimeFrom = first.openTime;
    next.weekendTimeTo = first.closeTime;

    if (card.kind === 'date') {
      const dates = items.map((item) => item.date).filter(Boolean) as string[];
      dates.sort();
      if (dates.length > 0) {
        next.dateFrom = dates[0];
        next.dateTo = dates[dates.length - 1];
      }
      const dayNumbers = dates.map((value) => {
        const date = new Date(value);
        const jsDay = date.getDay();
        return (((jsDay + 6) % 7) + 1) as DayNumber;
      });
      next.weekdayDays = Array.from(new Set(dayNumbers.filter((day) => day <= 5))).sort(
        (a, b) => a - b
      );
      next.weekendDays = Array.from(new Set(dayNumbers.filter((day) => day >= 6))).sort(
        (a, b) => a - b
      );
      next.sameAsWeekdays = true;
    } else if (card.kind === 'weekend') {
      const days = items.map((item) => item.day).filter(Boolean) as DayNumber[];
      next.weekdayDays = [];
      next.weekendDays = days;
      next.sameAsWeekdays = false;
    } else {
      const days = items.map((item) => item.day).filter(Boolean) as DayNumber[];
      next.weekdayDays = days;
      next.weekendDays = [];
      next.sameAsWeekdays = true;
    }

    this.editing = { kind: 'base', id: card.id, ids: card.ids };
    this.baseForm = next;
    this.panelMode = 'base-form';
  }

  editSpecialByIds(ids: string[]) {
    const items = this.dataStore.specialTime.filter((special) => ids.includes(special.id));
    if (items.length === 0) return;
    const dates = items.map((item) => item.date).filter(Boolean) as string[];
    dates.sort();

    this.editing = { kind: 'special', id: ids[0], ids };
    this.specialForm = {
      ...createSpecialFormState(),
      dateFrom: dates[0] || '',
      dateTo: dates[dates.length - 1] || '',
      timeFrom: items[0].openTime,
      timeTo: items[0].closeTime
    };
    this.panelMode = 'special-form';
  }

  async saveBase() {
    const entries = buildWorkEntries(this.baseForm);
    if (entries.length === 0) return;

    if (this.editing?.kind === 'base') {
      await this.dataStore.replaceWorkEntries(this.editing.ids ?? [this.editing.id], entries);
      runInAction(() => {
        this.notice = 'Основное расписание обновлено';
      });
    } else {
      await this.dataStore.addWorkEntries(entries);
      runInAction(() => {
        this.notice = 'Основное расписание создано';
      });
    }

    runInAction(() => {
      this.resetEditing();
    });
  }

  async saveSpecial() {
    const entries = buildSpecialEntries(this.specialForm);
    if (entries.length === 0) return;

    if (this.editing?.kind === 'special') {
      await this.dataStore.replaceSpecialEntries(this.editing.ids ?? [this.editing.id], entries);
      runInAction(() => {
        this.notice = 'Специальное расписание обновлено';
      });
    } else {
      await this.dataStore.addSpecialEntries(entries);
      runInAction(() => {
        this.notice = 'Специальное расписание создано';
      });
    }

    runInAction(() => {
      this.specialForm = createSpecialFormState();
      this.resetEditing();
    });
  }

  closeConfirm() {
    this.confirmState = { ...this.confirmState, open: false, onConfirm: null };
  }

  requestConfirm(config: {
    title: string;
    description: string;
    confirmLabel?: string;
    details?: {
      base: string[];
      special: string[];
    };
    reasonLabel?: string;
    reasonPlaceholder?: string;
    onConfirm: (reason?: string) => void | Promise<void>;
  }) {
    this.confirmState = {
      open: true,
      title: config.title,
      description: config.description,
      confirmLabel: config.confirmLabel || 'Удалить',
      details: config.details,
      reasonLabel: config.reasonLabel,
      reasonPlaceholder: config.reasonPlaceholder,
      onConfirm: config.onConfirm
    };
  }

  async confirmAction(reason?: string) {
    if (this.confirmState.onConfirm) {
      await this.confirmState.onConfirm(reason);
    }
    this.closeConfirm();
  }

  deleteBase(ids: string[]) {
    this.openDeleteDialog(ids, []);
  }

  deleteSpecial(ids: string[]) {
    this.openDeleteDialog([], ids);
  }

  deleteSelected() {
    if (this.selectedCount === 0) return;
    this.openDeleteDialog(this.selectedBaseIds, this.selectedSpecialIds, 'Удалить выбранные');
  }

  clearAll() {
    const allBaseIds = this.dataStore.workTime.map((item) => item.id);
    const allSpecialIds = this.dataStore.specialTime.map((item) => item.id);
    this.openDeleteDialog(allBaseIds, allSpecialIds, 'Удалить все');
  }

  private openDeleteDialog(
    baseIds: string[],
    specialIds: string[],
    confirmLabel: string = 'Удалить'
  ) {
    const details = this.buildDetailsForIds(baseIds, specialIds);

    this.requestConfirm({
      title: 'Удаление',
      description: this.getDeleteDescription(confirmLabel),
      confirmLabel,
      details,
      onConfirm: async () => {
        await Promise.all([
          ...baseIds.map((id) => this.dataStore.removeWorkEntry(id)),
          ...specialIds.map((id) => this.dataStore.removeSpecialEntry(id))
        ]);
        runInAction(() => {
          this.notice =
            confirmLabel === 'Удалить все'
              ? 'Все записи удалены'
              : confirmLabel === 'Удалить выбранные'
                ? 'Выбранные записи удалены'
                : 'Запись удалена';
          this.selectedBaseIds = this.selectedBaseIds.filter((id) => !baseIds.includes(id));
          this.selectedSpecialIds = this.selectedSpecialIds.filter(
            (id) => !specialIds.includes(id)
          );
        });
      }
    });
  }

  private buildDetailsForIds(
    baseIds: string[],
    specialIds: string[]
  ): {
    base: string[];
    special: string[];
  } {
    const baseSet = new Set(baseIds);
    const specialSet = new Set(specialIds);

    const baseItems = this.dataStore.workTime.filter((item) => baseSet.has(item.id));
    const specialItems = this.dataStore.specialTime.filter((item) => specialSet.has(item.id));

    return {
      base: this.formatBaseDetails(baseItems),
      special: this.formatSpecialDetails(specialItems)
    };
  }

  private getDeleteDescription(confirmLabel: string): string {
    if (confirmLabel === 'Удалить все') {
      return 'Вы уверены, что хотите удалить все режимы работы:';
    }
    if (confirmLabel === 'Удалить выбранные') {
      return 'Вы уверены, что хотите удалить выбранные режимы работы:';
    }
    return 'Вы уверены, что хотите удалить режим работы:';
  }

  private formatBaseDetails(items: TimeTableEntry[]): string[] {
    if (items.length === 0) return [];
    const year = this.calendarStore.year;
    const yearRange = `${this.formatDateShort(`${year}-01-01`)} - ${this.formatDateShort(
      `${year}-12-31`
    )}`;

    const dayBased = items.filter((item) => item.day);
    const dateBased = items.filter((item) => item.date);

    const lines: string[] = [];

    const timeGroups: Record<string, { weekday: boolean; weekend: boolean }> = {};
    dayBased.forEach((item) => {
      const timeLabel = `${item.openTime} - ${item.closeTime}`;
      if (!timeGroups[timeLabel]) {
        timeGroups[timeLabel] = { weekday: false, weekend: false };
      }
      const isWeekend = (item.day ?? 0) >= 6;
      if (isWeekend) {
        timeGroups[timeLabel].weekend = true;
      } else {
        timeGroups[timeLabel].weekday = true;
      }
    });

    Object.keys(timeGroups)
      .sort()
      .forEach((timeLabel) => {
        const group = timeGroups[timeLabel];
        if (group.weekday) {
          lines.push(`${yearRange} (Будни ${timeLabel})`);
        }
        if (group.weekend) {
          lines.push(`${yearRange} (Выходные ${timeLabel})`);
        }
      });

    if (dateBased.length > 0) {
      const rangesByTime = this.buildRangesByTime(dateBased);
      rangesByTime.forEach(({ timeLabel, ranges }) => {
        ranges.forEach((range) => {
          const rangeLabel = this.formatDateRangeShort(range.from, range.to);
          const dayType = this.getRangeDayType(range.from, range.to);
          const typeLabel =
            dayType === 'weekday' ? 'Будни ' : dayType === 'weekend' ? 'Выходные ' : '';
          lines.push(`${rangeLabel} (${typeLabel}${timeLabel})`);
        });
      });
    }

    return lines;
  }

  private formatSpecialDetails(items: TimeTableEntry[]): string[] {
    if (items.length === 0) return [];
    const rangesByTime = this.buildRangesByTime(items);
    const lines: string[] = [];

    rangesByTime.forEach(({ timeLabel, ranges }) => {
      ranges.forEach((range) => {
        const days = this.countDays(range.from, range.to);
        const daysLabel = `${days} дн.`;
        if (range.from === range.to) {
          lines.push(`${this.formatDateFull(range.from)} (${daysLabel}) - ${timeLabel}`);
          return;
        }
        lines.push(
          `${this.formatDateFull(range.from)} - ${this.formatDateFull(range.to)} (${daysLabel}) - ${timeLabel}`
        );
      });
    });

    return lines;
  }

  private buildRangesByTime(items: TimeTableEntry[]): Array<{
    timeLabel: string;
    ranges: Array<{ from: string; to: string }>;
  }> {
    const grouped: Record<string, string[]> = {};
    items.forEach((item) => {
      if (!item.date) return;
      const timeLabel = `${item.openTime} - ${item.closeTime}`;
      if (!grouped[timeLabel]) grouped[timeLabel] = [];
      grouped[timeLabel].push(item.date);
    });

    return Object.entries(grouped).map(([timeLabel, dates]) => ({
      timeLabel,
      ranges: this.buildDateRanges(dates)
    }));
  }

  private buildDateRanges(dates: string[]): Array<{ from: string; to: string }> {
    const sorted = Array.from(new Set(dates)).sort();
    if (sorted.length === 0) return [];
    const ranges: Array<{ from: string; to: string }> = [];
    let start = sorted[0];
    let prev = sorted[0];
    for (let i = 1; i < sorted.length; i += 1) {
      const current = sorted[i];
      const prevDate = new Date(prev);
      const nextDate = new Date(prevDate);
      nextDate.setDate(prevDate.getDate() + 1);
      if (nextDate.toISOString().slice(0, 10) === current) {
        prev = current;
        continue;
      }
      ranges.push({ from: start, to: prev });
      start = current;
      prev = current;
    }
    ranges.push({ from: start, to: prev });
    return ranges;
  }

  private countDays(from: string, to: string): number {
    const start = new Date(from);
    const end = new Date(to);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
    const diffMs = end.getTime() - start.getTime();
    return Math.floor(diffMs / (24 * 60 * 60 * 1000)) + 1;
  }

  private getRangeDayType(from: string, to: string): 'weekday' | 'weekend' | 'mixed' {
    const start = new Date(from);
    const end = new Date(to);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'mixed';
    let hasWeekday = false;
    let hasWeekend = false;
    const cursor = new Date(start);
    while (cursor <= end) {
      const day = cursor.getDay();
      if (day === 0 || day === 6) {
        hasWeekend = true;
      } else {
        hasWeekday = true;
      }
      if (hasWeekday && hasWeekend) return 'mixed';
      cursor.setDate(cursor.getDate() + 1);
    }
    if (hasWeekday && !hasWeekend) return 'weekday';
    if (hasWeekend && !hasWeekday) return 'weekend';
    return 'mixed';
  }

  private formatDateRangeShort(from: string, to: string): string {
    if (from === to) return this.formatDateShort(from);
    return `${this.formatDateShort(from)} - ${this.formatDateShort(to)}`;
  }

  private formatDateShort(value: string | Date): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'long'
    }).format(date);
  }

  private formatDateFull(value: string | Date): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
}

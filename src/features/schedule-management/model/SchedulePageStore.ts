import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { CalendarViewStore } from './CalendarViewStore';
import { createBaseFormState, createSpecialFormState } from './formDefaults';
import { buildBasePayloads, buildSpecialPayload, toBaseCards, toSpecialCards } from './mappers';
import { toDateInput } from '../../../shared/lib/dateFormat';
import type {
  BaseCard,
  BaseFormState,
  ConfirmState,
  EditingState,
  SpecialCard,
  SpecialFormState
} from './types';
import type { BaseSchedule, DayNumber } from '../../../entities/schedule/model/types';
import type { ZoneScheduleStore } from '../../../entities/schedule/model/ZoneScheduleStore';

const DAY_LABELS: Record<DayNumber, string> = {
  1: 'пн',
  2: 'вт',
  3: 'ср',
  4: 'чт',
  5: 'пт',
  6: 'сб',
  7: 'вс'
};

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
      () => this.dataStore.zoneCode,
      () => {
        this.dataStore.load();
      },
      { fireImmediately: true }
    );
  }

  get hasAnySchedules(): boolean {
    return this.dataStore.baseSchedules.length > 0 || this.dataStore.specialSchedules.length > 0;
  }

  get hasBaseSchedules(): boolean {
    return this.dataStore.baseSchedules.length > 0;
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
    return toBaseCards(this.dataStore.baseSchedules);
  }

  get specialCards(): SpecialCard[] {
    return toSpecialCards(this.dataStore.specialSchedules);
  }

  get selectedCount(): number {
    return this.selectedBaseIds.length + this.selectedSpecialIds.length;
  }

  get allSelected(): boolean {
    const total = this.dataStore.baseSchedules.length + this.dataStore.specialSchedules.length;
    return total > 0 && this.selectedCount === total;
  }

  get someSelected(): boolean {
    return this.selectedCount > 0 && !this.allSelected;
  }

  get isMultiSelect(): boolean {
    return this.selectedCount > 1;
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

  toggleBaseSelection(id: string) {
    this.selectedBaseIds = this.toggleSelection(this.selectedBaseIds, id);
  }

  toggleSpecialSelection(id: string) {
    this.selectedSpecialIds = this.toggleSelection(this.selectedSpecialIds, id);
  }

  toggleAllSelections() {
    if (this.allSelected) {
      this.selectedBaseIds = [];
      this.selectedSpecialIds = [];
      return;
    }

    this.selectedBaseIds = this.dataStore.baseSchedules.map((item) => item.id);
    this.selectedSpecialIds = this.dataStore.specialSchedules.map((item) => item.id);
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

  resetEditing() {
    this.editing = null;
    this.panelMode = 'none';
  }

  startCreateBase() {
    if (this.hasBaseSchedules) {
      this.startCreateSpecial();
      return;
    }
    this.notice = '';
    this.editing = null;
    this.panelMode = 'base-form';
  }

  startCreateSpecial() {
    this.notice = '';
    this.editing = null;
    this.panelMode = 'special-form';
  }

  startCreate() {
    if (this.hasBaseSchedules) {
      this.startCreateSpecial();
    } else {
      this.startCreateBase();
    }
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

  private findBaseByDays(days: DayNumber[]): BaseSchedule | undefined {
    return this.dataStore.baseSchedules.find(
      (item) =>
        item.daysOfWeek.length === days.length && days.every((d) => item.daysOfWeek.includes(d))
    );
  }

  editBaseById(id: string) {
    const item = this.dataStore.baseSchedules.find((base) => base.id === id);
    if (!item) return;

    const weekdayExisting = this.findBaseByDays([1, 2, 3, 4, 5]) || item;
    const weekendExisting = this.findBaseByDays([6, 7]);

    this.editing = { kind: 'base', id: item.id };
    this.baseForm = {
      ...this.baseForm,
      weekdayTitle: weekdayExisting?.title || this.baseForm.weekdayTitle,
      weekdayFrom: toDateInput(weekdayExisting?.validFrom),
      weekdayTo: toDateInput(weekdayExisting?.validTo),
      weekdayTimeFrom: weekdayExisting?.timeFrom || this.baseForm.weekdayTimeFrom,
      weekdayTimeTo: weekdayExisting?.timeTo || this.baseForm.weekdayTimeTo,
      weekdayDays: weekdayExisting?.daysOfWeek || this.baseForm.weekdayDays,
      weekendTitle: weekendExisting?.title || this.baseForm.weekendTitle,
      weekendFrom: toDateInput(weekendExisting?.validFrom),
      weekendTo: toDateInput(weekendExisting?.validTo),
      weekendTimeFrom: weekendExisting?.timeFrom || this.baseForm.weekendTimeFrom,
      weekendTimeTo: weekendExisting?.timeTo || this.baseForm.weekendTimeTo,
      weekendDays: weekendExisting?.daysOfWeek || this.baseForm.weekendDays,
      sameAsWeekdays: !weekendExisting
    };
    this.panelMode = 'base-form';
  }

  editSpecialById(id: string) {
    const item = this.dataStore.specialSchedules.find((special) => special.id === id);
    if (!item) return;

    const from = new Date(item.dateFrom);
    const to = new Date(item.dateTo);

    this.editing = { kind: 'special', id: item.id };
    this.specialForm = {
      ...createSpecialFormState(),
      title: item.title,
      dateFrom: toDateInput(from),
      dateTo: toDateInput(to),
      timeFrom: from.toISOString().slice(11, 16),
      timeTo: to.toISOString().slice(11, 16)
    };
    this.panelMode = 'special-form';
  }

  async saveBase() {
    const { weekday, weekend } = buildBasePayloads(this.baseForm);

    if (this.editing?.kind === 'base') {
      const weekdayExisting = this.findBaseByDays(this.baseForm.weekdayDays);
      const weekendExisting = this.findBaseByDays(this.baseForm.weekendDays);

      if (weekdayExisting) await this.dataStore.editBase(weekdayExisting.id, weekday);
      else await this.dataStore.addBase(weekday);

      if (!this.baseForm.sameAsWeekdays) {
        if (weekendExisting) await this.dataStore.editBase(weekendExisting.id, weekend);
        else await this.dataStore.addBase(weekend);
      } else if (weekendExisting) {
        await this.dataStore.removeBase(weekendExisting.id);
      }

      runInAction(() => {
        this.notice = 'Основное расписание обновлено';
      });
    } else {
      await this.dataStore.addBase(weekday);
      if (!this.baseForm.sameAsWeekdays) {
        await this.dataStore.addBase(weekend);
      }

      runInAction(() => {
        this.notice = 'Основное расписание создано';
      });
    }

    runInAction(() => {
      this.resetEditing();
    });
  }

  async saveSpecial() {
    const payload = buildSpecialPayload(this.specialForm);

    if (this.editing?.kind === 'special') {
      await this.dataStore.editSpecial(this.editing.id, payload);
      runInAction(() => {
        this.notice = 'Специальное расписание обновлено';
      });
    } else {
      await this.dataStore.addSpecial(payload);
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

  deleteBase(id: string) {
    this.openDeleteDialog([id], []);
  }

  deleteSpecial(id: string) {
    this.openDeleteDialog([], [id]);
  }

  deleteSelected() {
    if (this.selectedCount === 0) return;
    this.openDeleteDialog(this.selectedBaseIds, this.selectedSpecialIds, 'Удалить выбранные');
  }

  clearAll() {
    const allBaseIds = this.dataStore.baseSchedules.map((item) => item.id);
    const allSpecialIds = this.dataStore.specialSchedules.map((item) => item.id);
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
      description: 'Вы уверены, что хотите удалить режимы работы:',
      confirmLabel,
      details,
      reasonLabel: 'Причина удаления',
      reasonPlaceholder: 'Опишите причину удаления (например, обновление графика или ошибочная загрузка).',
      onConfirm: async () => {
        await Promise.all([
          ...baseIds.map((id) => this.dataStore.removeBase(id)),
          ...specialIds.map((id) => this.dataStore.removeSpecial(id))
        ]);
        runInAction(() => {
          this.notice =
            confirmLabel === 'Удалить все'
              ? 'Все расписания удалены'
              : confirmLabel === 'Удалить выбранные'
                ? 'Выбранные расписания удалены'
                : 'Расписание удалено';
          this.selectedBaseIds = this.selectedBaseIds.filter((id) => !baseIds.includes(id));
          this.selectedSpecialIds = this.selectedSpecialIds.filter((id) => !specialIds.includes(id));
        });
      }
    });
  }

  private buildDetailsForIds(baseIds: string[], specialIds: string[]): {
    base: string[];
    special: string[];
  } {
    const baseSet = new Set(baseIds);
    const specialSet = new Set(specialIds);

    return {
      base: this.dataStore.baseSchedules
        .filter((item) => baseSet.has(item.id))
        .map((item) => {
          const fromLabel = this.formatDateFull(item.validFrom);
          const toLabel = this.formatDateFull(item.validTo);
          const daysLabel = this.formatDaysLabel(item.daysOfWeek);
          return `${fromLabel} - ${toLabel} (${daysLabel} ${item.timeFrom} - ${item.timeTo})`;
        }),
      special: this.dataStore.specialSchedules
        .filter((item) => specialSet.has(item.id))
        .map((item) => {
          const from = new Date(item.dateFrom);
          const to = new Date(item.dateTo);
          const fromLabel = this.formatDateFull(from);
          const toLabel = this.formatDateFull(to);
          const days = Math.max(1, Math.ceil((to.getTime() - from.getTime()) / 86400000) + 1);
          const dateLabel =
            fromLabel === toLabel
              ? `${fromLabel} (${days} дн.)`
              : `${fromLabel} - ${toLabel} (${days} дн.)`;
          const timeLabel = `${from.toISOString().slice(11, 16)} - ${to.toISOString().slice(11, 16)}`;
          return `${dateLabel} - ${timeLabel}`;
        })
    };
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

  private formatDaysLabel(days: DayNumber[]): string {
    const sorted = [...days].sort((a, b) => a - b);
    const weekdays = [1, 2, 3, 4, 5];
    const weekend = [6, 7];
    const isWeekdays = sorted.length === 5 && weekdays.every((day) => sorted.includes(day));
    if (isWeekdays) return 'Будни';
    const isWeekend = sorted.length === 2 && weekend.every((day) => sorted.includes(day));
    if (isWeekend) return 'Выходные';
    return `Дни ${sorted.map((day) => DAY_LABELS[day]).join(', ')}`;
  }
}
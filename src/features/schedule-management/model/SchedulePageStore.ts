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

  private toggleDay(list: DayNumber[], day: DayNumber): DayNumber[] {
    return list.includes(day)
      ? list.filter((item) => item !== day)
      : [...list, day].sort((a, b) => a - b);
  }

  resetEditing() {
    this.editing = null;
    this.panelMode = 'none';
  }

  startCreateBase() {
    this.notice = '';
    this.editing = null;
    this.panelMode = 'base-form';
  }

  startCreateSpecial() {
    this.notice = '';
    this.editing = null;
    this.panelMode = 'special-form';
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
    onConfirm: () => void | Promise<void>;
  }) {
    this.confirmState = {
      open: true,
      title: config.title,
      description: config.description,
      confirmLabel: config.confirmLabel || 'Удалить',
      onConfirm: config.onConfirm
    };
  }

  async confirmAction() {
    if (this.confirmState.onConfirm) {
      await this.confirmState.onConfirm();
    }
    this.closeConfirm();
  }

  deleteBase(id: string) {
    this.requestConfirm({
      title: 'Удалить расписание?',
      description: 'Запись будет удалена без возможности восстановления.',
      onConfirm: async () => {
        await this.dataStore.removeBase(id);
        runInAction(() => {
          this.notice = 'Расписание удалено';
        });
      }
    });
  }

  deleteSpecial(id: string) {
    this.requestConfirm({
      title: 'Удалить расписание?',
      description: 'Запись будет удалена без возможности восстановления.',
      onConfirm: async () => {
        await this.dataStore.removeSpecial(id);
        runInAction(() => {
          this.notice = 'Расписание удалено';
        });
      }
    });
  }

  clearAll() {
    this.requestConfirm({
      title: 'Удалить все расписания?',
      description: 'Будут удалены все базовые и специальные интервалы.',
      confirmLabel: 'Удалить все',
      onConfirm: async () => {
        await this.dataStore.clearAll();
        runInAction(() => {
          this.notice = 'Все расписания удалены';
        });
      }
    });
  }
}

import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { BASE_FORM_TEMPLATE, DAY_LABEL, SPECIAL_FORM_TEMPLATE } from '../constants/schedule';
import { formatDate, toDateInput } from '../utils/calendar';
import { CalendarViewStore } from './calendarViewStore';

const cloneBaseForm = () => ({
  ...BASE_FORM_TEMPLATE,
  weekdayDays: [...BASE_FORM_TEMPLATE.weekdayDays],
  weekendDays: [...BASE_FORM_TEMPLATE.weekendDays]
});

const cloneSpecialForm = () => ({ ...SPECIAL_FORM_TEMPLATE });

export class SchedulePageStore {
  panelMode = 'none';
  notice = '';
  baseForm = cloneBaseForm();
  specialForm = cloneSpecialForm();
  editing = null;
  confirmState = {
    open: false,
    title: '',
    description: '',
    confirmLabel: 'Ð£Ð´Ð°Ð»Ð¸Ñ‚ÑŒ',
    onConfirm: null
  };

  constructor(dataStore) {
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

  get hasAnySchedules() {
    return this.dataStore.baseSchedules.length > 0 || this.dataStore.specialSchedules.length > 0;
  }

  get loading() {
    return this.dataStore.loading || this.dataStore.saving;
  }

  get error() {
    return this.dataStore.error;
  }

  get hasConflicts() {
    return this.dataStore.hasConflicts;
  }

  get baseCards() {
    return this.dataStore.baseSchedules.map((item) => ({
      id: item.id,
      title: item.title,
      dateLabel: `${formatDate(item.validFrom)} — ${formatDate(item.validTo)}`,
      timeLabel: `${item.timeFrom} - ${item.timeTo}`,
      days: item.daysOfWeek.map((day) => DAY_LABEL[day])
    }));
  }

  get specialCards() {
    return this.dataStore.specialSchedules.map((item) => {
      const from = new Date(item.dateFrom);
      const to = new Date(item.dateTo);
      const days = Math.max(1, Math.ceil((to - from) / 86400000) + 1);

      return {
        id: item.id,
        title: item.title,
        dateLabel: `${formatDate(item.dateFrom)} — ${formatDate(item.dateTo)}`,
        daysLabel: `${days} Ð´Ð½.`,
        timeLabel: `${from.toISOString().slice(11, 16)} - ${to.toISOString().slice(11, 16)}`,
        reasonLabel: `ÐŸÑ€Ð¸Ñ‡Ð¸Ð½Ð°: ${item.reason || 'Ð ÑƒÑ‡Ð½Ð°Ñ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ°'}`
      };
    });
  }

  updateBaseForm(patch) {
    this.baseForm = { ...this.baseForm, ...patch };
  }

  updateSpecialForm(patch) {
    this.specialForm = { ...this.specialForm, ...patch };
  }

  toggleWeekdayDay(day) {
    this.baseForm = {
      ...this.baseForm,
      weekdayDays: this.toggleDay(this.baseForm.weekdayDays, day)
    };
  }

  toggleWeekendDay(day) {
    this.baseForm = {
      ...this.baseForm,
      weekendDays: this.toggleDay(this.baseForm.weekendDays, day)
    };
  }

  toggleDay(list, day) {
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

  changeModeFromCalendar(date) {
    this.notice = '';
    this.editing = null;
    this.specialForm = {
      ...this.specialForm,
      dateFrom: toDateInput(date),
      dateTo: toDateInput(date)
    };
    this.panelMode = 'special-form';
  }

  findBaseByDays(days) {
    return this.dataStore.baseSchedules.find(
      (item) =>
        item.daysOfWeek.length === days.length && days.every((d) => item.daysOfWeek.includes(d))
    );
  }

  editBaseById(id) {
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

  editSpecialById(id) {
    const item = this.dataStore.specialSchedules.find((special) => special.id === id);
    if (!item) return;

    const from = new Date(item.dateFrom);
    const to = new Date(item.dateTo);

    this.editing = { kind: 'special', id: item.id };
    this.specialForm = {
      ...SPECIAL_FORM_TEMPLATE,
      title: item.title,
      dateFrom: toDateInput(from),
      dateTo: toDateInput(to),
      timeFrom: from.toISOString().slice(11, 16),
      timeTo: to.toISOString().slice(11, 16)
    };
    this.panelMode = 'special-form';
  }

  async saveBase() {
    const weekdayPayload = {
      title: this.baseForm.weekdayTitle,
      timeFrom: this.baseForm.weekdayTimeFrom,
      timeTo: this.baseForm.weekdayTimeTo,
      daysOfWeek: this.baseForm.weekdayDays,
      validFrom: this.baseForm.weekdayFrom,
      validTo: this.baseForm.weekdayTo
    };

    const weekendPayload = {
      title: this.baseForm.weekendTitle,
      timeFrom: this.baseForm.sameAsWeekdays
        ? this.baseForm.weekdayTimeFrom
        : this.baseForm.weekendTimeFrom,
      timeTo: this.baseForm.sameAsWeekdays
        ? this.baseForm.weekdayTimeTo
        : this.baseForm.weekendTimeTo,
      daysOfWeek: this.baseForm.weekendDays,
      validFrom: this.baseForm.sameAsWeekdays
        ? this.baseForm.weekdayFrom
        : this.baseForm.weekendFrom || this.baseForm.weekdayFrom,
      validTo: this.baseForm.sameAsWeekdays
        ? this.baseForm.weekdayTo
        : this.baseForm.weekendTo || this.baseForm.weekdayTo
    };

    if (this.editing?.kind === 'base') {
      const weekdayExisting = this.findBaseByDays(this.baseForm.weekdayDays);
      const weekendExisting = this.findBaseByDays(this.baseForm.weekendDays);

      if (weekdayExisting) await this.dataStore.editBase(weekdayExisting.id, weekdayPayload);
      else await this.dataStore.addBase(weekdayPayload);

      if (!this.baseForm.sameAsWeekdays) {
        if (weekendExisting) await this.dataStore.editBase(weekendExisting.id, weekendPayload);
        else await this.dataStore.addBase(weekendPayload);
      } else if (weekendExisting) {
        await this.dataStore.removeBase(weekendExisting.id);
      }

      runInAction(() => {
        this.notice = 'ÐžÑÐ½Ð¾Ð²Ð½Ð¾Ðµ Ñ€Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¾';
      });
    } else {
      await this.dataStore.addBase(weekdayPayload);
      if (!this.baseForm.sameAsWeekdays) {
        await this.dataStore.addBase(weekendPayload);
      }

      runInAction(() => {
        this.notice = 'ÐžÑÐ½Ð¾Ð²Ð½Ð¾Ðµ Ñ€Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ ÑÐ¾Ð·Ð´Ð°Ð½Ð¾';
      });
    }

    runInAction(() => {
      this.resetEditing();
    });
  }

  async saveSpecial() {
    const payload = {
      title: this.specialForm.title,
      dateFrom: new Date(
        `${this.specialForm.dateFrom}T${this.specialForm.timeFrom}:00`
      ).toISOString(),
      dateTo: new Date(`${this.specialForm.dateTo}T${this.specialForm.timeTo}:00`).toISOString(),
      priority: 100,
      reason: 'Ð ÑƒÑ‡Ð½Ð°Ñ Ð½Ð°ÑÑ‚Ñ€Ð¾Ð¹ÐºÐ°',
      isOverrideBase: true
    };

    if (this.editing?.kind === 'special') {
      await this.dataStore.editSpecial(this.editing.id, payload);
      runInAction(() => {
        this.notice = 'Ð¡Ð¿ÐµÑ†Ð¸Ð°Ð»ÑŒÐ½Ð¾Ðµ Ñ€Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¾';
      });
    } else {
      await this.dataStore.addSpecial(payload);
      runInAction(() => {
        this.notice = 'Ð¡Ð¿ÐµÑ†Ð¸Ð°Ð»ÑŒÐ½Ð¾Ðµ Ñ€Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ ÑÐ¾Ð·Ð´Ð°Ð½Ð¾';
      });
    }

    runInAction(() => {
      this.specialForm = cloneSpecialForm();
      this.resetEditing();
    });
  }

  closeConfirm() {
    this.confirmState = { ...this.confirmState, open: false, onConfirm: null };
  }

  requestConfirm(config) {
    this.confirmState = {
      open: true,
      title: config.title,
      description: config.description,
      confirmLabel: config.confirmLabel || 'Ð£Ð´Ð°Ð»Ð¸Ñ‚ÑŒ',
      onConfirm: config.onConfirm
    };
  }

  async confirmAction() {
    if (this.confirmState.onConfirm) {
      await this.confirmState.onConfirm();
    }
    this.closeConfirm();
  }

  deleteBase(id) {
    this.requestConfirm({
      title: 'Ð£Ð´Ð°Ð»Ð¸Ñ‚ÑŒ Ñ€Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ?',
      description:
        'Ð—Ð°Ð¿Ð¸ÑÑŒ Ð±ÑƒÐ´ÐµÑ‚ ÑƒÐ´Ð°Ð»ÐµÐ½Ð° Ð±ÐµÐ· Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚Ð¸ Ð²Ð¾ÑÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ.',
      onConfirm: async () => {
        await this.dataStore.removeBase(id);
        runInAction(() => {
          this.notice = 'Ð Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ ÑƒÐ´Ð°Ð»ÐµÐ½Ð¾';
        });
      }
    });
  }

  deleteSpecial(id) {
    this.requestConfirm({
      title: 'Ð£Ð´Ð°Ð»Ð¸Ñ‚ÑŒ Ñ€Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ?',
      description:
        'Ð—Ð°Ð¿Ð¸ÑÑŒ Ð±ÑƒÐ´ÐµÑ‚ ÑƒÐ´Ð°Ð»ÐµÐ½Ð° Ð±ÐµÐ· Ð²Ð¾Ð·Ð¼Ð¾Ð¶Ð½Ð¾ÑÑ‚Ð¸ Ð²Ð¾ÑÑÑ‚Ð°Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ñ.',
      onConfirm: async () => {
        await this.dataStore.removeSpecial(id);
        runInAction(() => {
          this.notice = 'Ð Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ðµ ÑƒÐ´Ð°Ð»ÐµÐ½Ð¾';
        });
      }
    });
  }

  clearAll() {
    this.requestConfirm({
      title: 'Ð£Ð´Ð°Ð»Ð¸Ñ‚ÑŒ Ð²ÑÐµ Ñ€Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ñ?',
      description:
        'Ð‘ÑƒÐ´ÑƒÑ‚ ÑƒÐ´Ð°Ð»ÐµÐ½Ñ‹ Ð²ÑÐµ Ð±Ð°Ð·Ð¾Ð²Ñ‹Ðµ Ð¸ ÑÐ¿ÐµÑ†Ð¸Ð°Ð»ÑŒÐ½Ñ‹Ðµ Ð¸Ð½Ñ‚ÐµÑ€Ð²Ð°Ð»Ñ‹.',
      confirmLabel: 'Ð£Ð´Ð°Ð»Ð¸Ñ‚ÑŒ Ð²ÑÐµ',
      onConfirm: async () => {
        await this.dataStore.clearAll();
        runInAction(() => {
          this.notice = 'Ð’ÑÐµ Ñ€Ð°ÑÐ¿Ð¸ÑÐ°Ð½Ð¸Ñ ÑƒÐ´Ð°Ð»ÐµÐ½Ñ‹';
        });
      }
    });
  }
}

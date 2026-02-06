import { makeAutoObservable, runInAction } from 'mobx';
import { ScheduleModel } from '../model/scheduleModel';

export class ZoneScheduleStore {
  zoneCode = 'zone24';
  model = new ScheduleModel();
  loading = false;
  saving = false;
  error = null;

  constructor(service) {
    this.service = service;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get baseSchedules() {
    return this.model.baseList;
  }

  get specialSchedules() {
    return this.model.specialList;
  }

  get hasConflicts() {
    return this.model.hasSpecialConflicts;
  }

  async load() {
    this.loading = true;
    this.error = null;
    try {
      const data = await this.service.getSchedules(this.zoneCode);
      runInAction(() => {
        this.model.setData(data.base, data.special);
      });
    } catch (e) {
      runInAction(() => {
        this.error = e.message;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async addBase(payload) {
    await this.wrapSaving(async () => {
      const created = await this.service.createBase(this.zoneCode, payload);
      this.model.baseById.set(created.id, created);
    });
  }

  async editBase(id, payload) {
    await this.wrapSaving(async () => {
      const updated = await this.service.updateBase(this.zoneCode, id, payload);
      this.model.baseById.set(updated.id, updated);
    });
  }

  async removeBase(id) {
    await this.wrapSaving(async () => {
      await this.service.deleteBase(this.zoneCode, id);
      this.model.baseById.delete(id);
    });
  }

  async addSpecial(payload) {
    await this.wrapSaving(async () => {
      const created = await this.service.createSpecial(this.zoneCode, payload);
      this.model.specialById.set(created.id, created);
    });
  }

  async editSpecial(id, payload) {
    await this.wrapSaving(async () => {
      const updated = await this.service.updateSpecial(this.zoneCode, id, payload);
      this.model.specialById.set(updated.id, updated);
    });
  }

  async removeSpecial(id) {
    await this.wrapSaving(async () => {
      await this.service.deleteSpecial(this.zoneCode, id);
      this.model.specialById.delete(id);
    });
  }

  async clearAll() {
    await this.wrapSaving(async () => {
      await this.service.clearAll(this.zoneCode);
      this.model.setData([], []);
    });
  }

  async wrapSaving(callback) {
    this.saving = true;
    this.error = null;
    try {
      await callback();
    } catch (e) {
      runInAction(() => {
        this.error = e.message;
      });
      throw e;
    } finally {
      runInAction(() => {
        this.saving = false;
      });
    }
  }
}

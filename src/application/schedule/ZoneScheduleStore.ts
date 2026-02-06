import { makeAutoObservable, runInAction } from 'mobx';
import { ScheduleModel } from './ScheduleModel';
import type {
  BaseSchedulePayload,
  ScheduleResponse,
  SpecialSchedulePayload
} from '../../domain/schedule/types';
import type { ScheduleRepository } from './ScheduleRepository';

export class ZoneScheduleStore {
  zoneCode = 'zone24';
  model = new ScheduleModel();
  loading = false;
  saving = false;
  error: string | null = null;
  repository: ScheduleRepository;

  constructor(repository: ScheduleRepository) {
    this.repository = repository;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get baseSchedules() {
    return this.model.baseList;
  }

  get specialSchedules() {
    return this.model.specialList;
  }

  get hasConflicts() {
    return this.model.hasConflicts;
  }

  async load(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const data: ScheduleResponse = await this.repository.getSchedules(this.zoneCode);
      runInAction(() => {
        this.model.setData(data.base, data.special);
      });
    } catch (e: unknown) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : String(e);
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async addBase(payload: BaseSchedulePayload): Promise<void> {
    await this.wrapSaving(async () => {
      const created = await this.repository.createBase(this.zoneCode, payload);
      this.model.baseById.set(created.id, created);
    });
  }

  async editBase(id: string, payload: BaseSchedulePayload): Promise<void> {
    await this.wrapSaving(async () => {
      const updated = await this.repository.updateBase(this.zoneCode, id, payload);
      this.model.baseById.set(updated.id, updated);
    });
  }

  async removeBase(id: string): Promise<void> {
    await this.wrapSaving(async () => {
      await this.repository.deleteBase(this.zoneCode, id);
      this.model.baseById.delete(id);
    });
  }

  async addSpecial(payload: SpecialSchedulePayload): Promise<void> {
    await this.wrapSaving(async () => {
      const created = await this.repository.createSpecial(this.zoneCode, payload);
      this.model.specialById.set(created.id, created);
    });
  }

  async editSpecial(id: string, payload: SpecialSchedulePayload): Promise<void> {
    await this.wrapSaving(async () => {
      const updated = await this.repository.updateSpecial(this.zoneCode, id, payload);
      this.model.specialById.set(updated.id, updated);
    });
  }

  async removeSpecial(id: string): Promise<void> {
    await this.wrapSaving(async () => {
      await this.repository.deleteSpecial(this.zoneCode, id);
      this.model.specialById.delete(id);
    });
  }

  async clearAll(): Promise<void> {
    await this.wrapSaving(async () => {
      await this.repository.clearAll(this.zoneCode);
      this.model.setData([], []);
    });
  }

  private async wrapSaving(callback: () => Promise<void>): Promise<void> {
    this.saving = true;
    this.error = null;
    try {
      await callback();
    } catch (e: unknown) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : String(e);
      });
      throw e;
    } finally {
      runInAction(() => {
        this.saving = false;
      });
    }
  }
}

import { makeAutoObservable, runInAction } from 'mobx';
import { ScheduleModel } from './ScheduleModel';
import type { TimeTableEntry, TimeTableEntryApi, TimeTableZone, TimeTableZoneApi } from './types';
import type { ScheduleRepository } from '../api/ScheduleRepository';
import { DAY_LABEL } from '../../../shared/config/calendarConstants';

export class ZoneScheduleStore {
  zoneId = 'zone24';
  model = new ScheduleModel();
  loading = false;
  saving = false;
  error: string | null = null;
  repository: ScheduleRepository;

  constructor(repository: ScheduleRepository) {
    this.repository = repository;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get workTime(): TimeTableEntry[] {
    return this.model.workTime;
  }

  get specialTime(): TimeTableEntry[] {
    return this.model.specialTime;
  }

  get hasConflicts() {
    return this.model.hasConflicts;
  }

  async load(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      const data = await this.repository.getZoneTimeTable(this.zoneId);
      const zone = this.pickZone(data);
      const normalized = this.normalizeZone(zone);
      runInAction(() => {
        this.model.setZone(normalized);
        this.zoneId = normalized.id;
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

  async addWorkEntries(entries: TimeTableEntry[]): Promise<void> {
    await this.wrapSaving(async () => {
      this.model.setZone({
        id: this.zoneId,
        workTime: [...this.workTime, ...entries],
        specialTime: this.specialTime
      });
      await this.save();
    });
  }

  async replaceWorkEntry(id: string, entries: TimeTableEntry[]): Promise<void> {
    await this.wrapSaving(async () => {
      const next = this.workTime.filter((item) => item.id !== id);
      this.model.setZone({
        id: this.zoneId,
        workTime: [...next, ...entries],
        specialTime: this.specialTime
      });
      await this.save();
    });
  }

  async replaceWorkEntries(ids: string[], entries: TimeTableEntry[]): Promise<void> {
    await this.wrapSaving(async () => {
      const idSet = new Set(ids);
      const next = this.workTime.filter((item) => !idSet.has(item.id));
      this.model.setZone({
        id: this.zoneId,
        workTime: [...next, ...entries],
        specialTime: this.specialTime
      });
      await this.save();
    });
  }

  async removeWorkEntry(id: string): Promise<void> {
    await this.wrapSaving(async () => {
      this.model.setZone({
        id: this.zoneId,
        workTime: this.workTime.filter((item) => item.id !== id),
        specialTime: this.specialTime
      });
      await this.save();
    });
  }

  async addSpecialEntries(entries: TimeTableEntry[]): Promise<void> {
    await this.wrapSaving(async () => {
      this.model.setZone({
        id: this.zoneId,
        workTime: this.workTime,
        specialTime: [...this.specialTime, ...entries]
      });
      await this.save();
    });
  }

  async replaceSpecialEntry(id: string, entries: TimeTableEntry[]): Promise<void> {
    await this.wrapSaving(async () => {
      const next = this.specialTime.filter((item) => item.id !== id);
      this.model.setZone({
        id: this.zoneId,
        workTime: this.workTime,
        specialTime: [...next, ...entries]
      });
      await this.save();
    });
  }

  async replaceSpecialEntries(ids: string[], entries: TimeTableEntry[]): Promise<void> {
    await this.wrapSaving(async () => {
      const idSet = new Set(ids);
      const next = this.specialTime.filter((item) => !idSet.has(item.id));
      this.model.setZone({
        id: this.zoneId,
        workTime: this.workTime,
        specialTime: [...next, ...entries]
      });
      await this.save();
    });
  }

  async removeSpecialEntry(id: string): Promise<void> {
    await this.wrapSaving(async () => {
      this.model.setZone({
        id: this.zoneId,
        workTime: this.workTime,
        specialTime: this.specialTime.filter((item) => item.id !== id)
      });
      await this.save();
    });
  }

  async clearAll(): Promise<void> {
    await this.wrapSaving(async () => {
      this.model.setZone({
        id: this.zoneId,
        workTime: [],
        specialTime: []
      });
      await this.save();
    });
  }

  private async save(): Promise<void> {
    const payload = [this.toApi(this.model.zone)];
    await this.repository.saveZoneTimeTable(payload);
  }

  private pickZone(items: TimeTableZoneApi[]): TimeTableZoneApi {
    if (items.length === 0) return { id: this.zoneId, workTime: [], specialTime: [] };
    const found = items.find((item) => item.id === this.zoneId);
    return found || items[0];
  }

  private normalizeZone(zone: TimeTableZoneApi): TimeTableZone {
    return {
      id: zone.id,
      workTime: (zone.workTime || []).map((item, index) =>
        this.normalizeEntry('work', item, index)
      ),
      specialTime: (zone.specialTime || []).map((item, index) =>
        this.normalizeEntry('special', item, index)
      )
    };
  }

  private normalizeEntry(
    kind: 'work' | 'special',
    entry: TimeTableEntryApi,
    index: number
  ): TimeTableEntry {
    return {
      id: `${kind}-${index}-${entry.day || 'x'}-${entry.date || 'x'}`,
      day: this.parseDay(entry.day),
      date: entry.date || null,
      openTime: entry.openTime || '00:00',
      closeTime: entry.closeTime || '00:00'
    };
  }

  private toApi(zone: TimeTableZone | null): TimeTableZoneApi {
    if (!zone) return { id: this.zoneId, workTime: [], specialTime: [] };
    return {
      id: zone.id,
      workTime: zone.workTime.map((item) => this.toEntryApi(item)),
      specialTime: zone.specialTime.map((item) => this.toEntryApi(item))
    };
  }

  private toEntryApi(entry: TimeTableEntry): TimeTableEntryApi {
    const dayLabel = this.resolveDayLabel(entry);
    return {
      day: dayLabel || undefined,
      date: entry.date || undefined,
      openTime: entry.openTime,
      closeTime: entry.closeTime
    };
  }

  private resolveDayLabel(entry: TimeTableEntry): string | null {
    if (entry.day) return DAY_LABEL[entry.day];
    if (entry.date) {
      const date = new Date(entry.date);
      if (!Number.isNaN(date.getTime())) {
        const jsDay = date.getDay(); // 0..6 (Sun..Sat)
        const dayNumber = (((jsDay + 6) % 7) + 1) as TimeTableEntry['day'];
        if (dayNumber) return DAY_LABEL[dayNumber];
      }
    }
    return null;
  }

  private parseDay(value?: string): TimeTableEntry['day'] {
    if (!value) return null;
    const trimmed = value.trim().toLowerCase();
    const numeric = Number(trimmed);
    if (numeric >= 1 && numeric <= 7) return numeric as TimeTableEntry['day'];
    const map: Record<string, TimeTableEntry['day']> = {
      пн: 1,
      пон: 1,
      понедельник: 1,
      вт: 2,
      втор: 2,
      вторник: 2,
      ср: 3,
      среда: 3,
      чт: 4,
      чет: 4,
      четверг: 4,
      пт: 5,
      пят: 5,
      пятница: 5,
      сб: 6,
      суб: 6,
      суббота: 6,
      вс: 7,
      воск: 7,
      воскресенье: 7,
      mon: 1,
      monday: 1,
      tue: 2,
      tuesday: 2,
      wed: 3,
      wednesday: 3,
      thu: 4,
      thursday: 4,
      fri: 5,
      friday: 5,
      sat: 6,
      saturday: 6,
      sun: 7,
      sunday: 7
    };
    return map[trimmed] ?? null;
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

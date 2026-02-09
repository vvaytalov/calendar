import { makeAutoObservable } from 'mobx';
import { hasSpecialConflicts } from './rules';
import type { TimeTableEntry, TimeTableZone } from './types';

export class ScheduleModel {
  zone: TimeTableZone | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setZone(zone: TimeTableZone) {
    this.zone = zone;
  }

  get workTime(): TimeTableEntry[] {
    return this.zone?.workTime ?? [];
  }

  get specialTime(): TimeTableEntry[] {
    return this.zone?.specialTime ?? [];
  }

  get hasConflicts(): boolean {
    return hasSpecialConflicts(this.specialTime);
  }
}

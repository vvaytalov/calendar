import { makeAutoObservable } from 'mobx';
import { hasSpecialConflicts } from './rules';
import type { BaseSchedule, SpecialSchedule } from './types';

export class ScheduleModel {
  baseById = new Map<string, BaseSchedule>();
  specialById = new Map<string, SpecialSchedule>();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setData(base: BaseSchedule[], special: SpecialSchedule[]) {
    this.baseById = new Map(base.map((item) => [item.id, item]));
    this.specialById = new Map(special.map((item) => [item.id, item]));
  }

  get baseList(): BaseSchedule[] {
    return [...this.baseById.values()];
  }

  get specialList(): SpecialSchedule[] {
    return [...this.specialById.values()].sort((a, b) => b.priority - a.priority);
  }

  get hasConflicts(): boolean {
    return hasSpecialConflicts(this.specialList);
  }
}

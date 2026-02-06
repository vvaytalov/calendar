export class ScheduleModel {
  baseById = new Map();
  specialById = new Map();

  setData(base, special) {
    this.baseById = new Map(base.map((item) => [item.id, item]));
    this.specialById = new Map(special.map((item) => [item.id, item]));
  }

  get baseList() {
    return [...this.baseById.values()];
  }

  get specialList() {
    return [...this.specialById.values()].sort((a, b) => b.priority - a.priority);
  }

  get hasSpecialConflicts() {
    const items = this.specialList.filter((x) => x.isOverrideBase);
    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        const a = items[i];
        const b = items[j];
        const conflict =
          a.priority === b.priority &&
          new Date(a.dateFrom) < new Date(b.dateTo) &&
          new Date(b.dateFrom) < new Date(a.dateTo);

        if (conflict) return true;
      }
    }

    return false;
  }
}

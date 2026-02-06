import { HttpScheduleRepository } from '../../infrastructure/schedule/HttpScheduleRepository';
import { SchedulePageStore } from './SchedulePageStore';
import { ZoneScheduleStore } from './ZoneScheduleStore';

export const createSchedulePageStore = (): SchedulePageStore => {
  const repository = new HttpScheduleRepository();
  const zoneStore = new ZoneScheduleStore(repository);
  return new SchedulePageStore(zoneStore);
};

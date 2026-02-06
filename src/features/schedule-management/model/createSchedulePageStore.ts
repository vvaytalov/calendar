import { HttpScheduleRepository } from '../../../entities/schedule/api/HttpScheduleRepository';
import { SchedulePageStore } from './SchedulePageStore';
import { ZoneScheduleStore } from '../../../entities/schedule/model/ZoneScheduleStore';

export const createSchedulePageStore = (): SchedulePageStore => {
  const repository = new HttpScheduleRepository();
  const zoneStore = new ZoneScheduleStore(repository);
  return new SchedulePageStore(zoneStore);
};

import type {
  BaseSchedule,
  BaseSchedulePayload,
  ScheduleResponse,
  SpecialSchedule,
  SpecialSchedulePayload
} from '../model/types';

export interface ScheduleRepository {
  getSchedules(zoneCode: string): Promise<ScheduleResponse>;
  createBase(zoneCode: string, payload: BaseSchedulePayload): Promise<BaseSchedule>;
  updateBase(zoneCode: string, id: string, payload: BaseSchedulePayload): Promise<BaseSchedule>;
  deleteBase(zoneCode: string, id: string): Promise<void>;
  createSpecial(zoneCode: string, payload: SpecialSchedulePayload): Promise<SpecialSchedule>;
  updateSpecial(
    zoneCode: string,
    id: string,
    payload: SpecialSchedulePayload
  ): Promise<SpecialSchedule>;
  deleteSpecial(zoneCode: string, id: string): Promise<void>;
  clearAll(zoneCode: string): Promise<void>;
}

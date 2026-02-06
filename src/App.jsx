import { useMemo } from 'react';
import { ScheduleService } from './service/scheduleService';
import { ZoneScheduleStore } from './store/zoneScheduleStore';
import { SchedulePageStore } from './store/schedulePageStore';
import { SchedulePage } from './components/schedule/SchedulePage';

const createStore = () => new SchedulePageStore(new ZoneScheduleStore(new ScheduleService()));

export default function App() {
  const store = useMemo(createStore, []);
  return <SchedulePage store={store} />;
}

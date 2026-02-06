import { useMemo } from 'react';
import { createSchedulePageStore } from '../features/schedule-management/model/createSchedulePageStore';
import { SchedulePage } from '../pages/schedule/ui/SchedulePage';

export default function App() {
  const store = useMemo(() => createSchedulePageStore(), []);
  return <SchedulePage store={store} />;
}

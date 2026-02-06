import { useMemo } from 'react';
import { createSchedulePageStore } from './application/schedule/createSchedulePageStore';
import { SchedulePage } from './components/schedule/SchedulePage';

export default function App() {
  const store = useMemo(() => createSchedulePageStore(), []);
  return <SchedulePage store={store} />;
}

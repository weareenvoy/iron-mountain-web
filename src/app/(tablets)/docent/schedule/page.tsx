import { Suspense } from 'react';
import ScheduleClient from './ScheduleClient';

export default function Page() {
  return (
    <Suspense>
      <ScheduleClient />
    </Suspense>
  );
}

import { Suspense } from 'react';
import ScheduleClient from './ScheduleClient';

const SchedulePage = () => {
  return (
    <Suspense>
      <ScheduleClient />
    </Suspense>
  );
};

export default SchedulePage;

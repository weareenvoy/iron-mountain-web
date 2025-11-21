import { Suspense } from 'react';
import ScheduleClient from './page.client';

const SchedulePage = () => {
  return (
    <Suspense>
      <ScheduleClient />
    </Suspense>
  );
};

export default SchedulePage;

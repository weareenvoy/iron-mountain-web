'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/shadcn/button';

export default function Home() {
  const router = useRouter();

  const apps = [
    {
      route: '/docent',
      title: 'Docent App',
    },
    {
      route: '/basecamp',
      title: 'Basecamp App',
    },
  ];

  return (
    <div className="bg-background-primary flex flex-col items-center justify-center gap-10">
      {apps.map((app, index) => (
        <Button
          className="w-full"
          key={index}
          onClick={e => {
            e.stopPropagation();
            router.push(app.route);
          }}
        >
          {app.title}
        </Button>
      ))}
    </div>
  );
}

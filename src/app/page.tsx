import Link from 'next/link';
import { Button } from '@/components/shadcn/button';
import { APPS } from '@/lib/internal/contants';

const Home = () => {
  return (
    <div className="bg-background-primary flex flex-col items-center justify-center gap-10">
      {APPS.map((app, index) => (
        <Button asChild className="w-full" key={index}>
          <Link href={app.route}>{app.title}</Link>
        </Button>
      ))}
    </div>
  );
};

export default Home;

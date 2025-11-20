import Link from 'next/link';
import { Button } from '@/components/shadcn/button';
import { APPS } from '@/lib/internal/contants';

const Home = ({}: PageProps<'/'>) => {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Apps:</h1>
        <div className="flex flex-col gap-2">
          {APPS.map((app, index) => (
            <Button asChild key={index} size="xl">
              <Link href={app.route}>{app.title}</Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

import Link from 'next/link';
import { Button } from '@/components/shadcn/button';
import { APPS } from '@/lib/internal/contants';

const Home = ({}: PageProps<'/'>) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-sans">
      <main className="flex w-full max-w-3xl flex-col items-center gap-y-8 px-16 py-32 sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">Apps:</h1>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          {APPS.map((app, index) => (
            <Button asChild className="h-12 md:w-[158px]" key={index} size="xl">
              <Link href={app.route}>{app.title}</Link>
            </Button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;

import { Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { SettingsDrawer } from '@/app/(tablets)/docent/_components/ui/SettingsDrawer';
import { Button } from '@/components/shadcn/button';
import type { PropsWithChildren } from 'react';

const DocentContent = ({ children }: PropsWithChildren) => {
  const { isConnected, isSettingsOpen, setIsSettingsOpen } = useDocent();
  const pathname = usePathname();
  const isHomePage = pathname === '/docent';

  return (
    <div className="relative flex h-[1133px] w-[744px] items-center justify-center overflow-hidden bg-linear-[348deg,#00A88E_0%,#1B75BC_100%]">
      {children}

      {/* TODO when we click Settings button, ask GEC, GEC will send back latest data */}
      {/* Global Settings Button - Show on all pages except home */}
      {isConnected && !isHomePage && (
        <div className="absolute top-34 right-5 z-50">
          <Button className="h-13 w-40 gap-3.5" onClick={() => setIsSettingsOpen(true)} size="sm" variant="outline">
            <Settings className="size-[24px]" />
            {/* When someone clicks it, asks for data (each exhibit's status) */}
            <span className="h-6.25 text-xl">Settings</span>
          </Button>
        </div>
      )}

      {/* Settings Drawer */}
      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default DocentContent;

'use client';

import { Settings } from 'lucide-react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import { Interstate } from '@/lib/internal/fonts';
import { cn } from '@/lib/tailwind/utils/cn';
import type { PropsWithChildren } from 'react';

const SettingsDrawer = dynamic(() => import('@/app/(tablets)/docent/_components/ui/SettingsDrawer'), { ssr: false });

const DocentContent = ({ children }: PropsWithChildren) => {
  const { isConnected, isSettingsOpen, setIsSettingsOpen } = useDocent();
  const pathname = usePathname();
  const isHomePage = pathname === '/docent';

  const openSettingsDrawer = () => {
    setIsSettingsOpen(true);
  };

  const closeSettingsDrawer = () => {
    setIsSettingsOpen(false);
  };

  return (
    <div
      className={cn(
        'text-foreground-primary bg-background-primary relative flex h-[1133px] w-[744px] items-center justify-center overflow-hidden bg-linear-[348deg,#00A88E_0%,#1B75BC_100%]',
        Interstate.className
      )}
      data-app="docent"
    >
      {children}

      {/* TODO when we click Settings button, ask GEC, GEC will send back latest data */}
      {/* Global Settings Button - Show on all pages except home */}
      {isConnected && !isHomePage && (
        <div className="absolute top-34 right-5 z-50">
          <Button className="h-13 w-40 gap-3.5" onClick={openSettingsDrawer} size="sm" variant="outline-light-grey">
            <Settings className="size-[24px]" />
            {/* When someone clicks it, asks for data (each exhibit's status) */}
            <span className="h-6.25 text-xl">Settings</span>
          </Button>
        </div>
      )}

      {/* Settings Drawer */}
      <SettingsDrawer isOpen={isSettingsOpen} onClose={closeSettingsDrawer} />
    </div>
  );
};

export default DocentContent;

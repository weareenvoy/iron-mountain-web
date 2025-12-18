'use client';

import { Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import SettingsDrawer from '@/app/(tablets)/docent/_components/ui/SettingsDrawer';
import { Interstate } from '@/lib/internal/fonts';
import { cn } from '@/lib/tailwind/utils/cn';
import type { PropsWithChildren } from 'react';

const DocentContent = ({ children }: PropsWithChildren) => {
  const { data, isConnected, isSettingsOpen, setIsSettingsOpen } = useDocent();
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

      {/* Global Settings Button - Show on all pages except home */}
      {isConnected && !isHomePage && (
        <div className="absolute top-39 right-5 z-50">
          <Button
            className="h-13 gap-2 border-none p-0"
            onClick={openSettingsDrawer}
            size="sm"
            variant="outline-light-grey"
          >
            {/* When someone clicks it, asks for data (each exhibit's status) */}
            <span className="h-6.25 text-lg">{data?.settings.title ?? 'Settings'}</span>
            <Settings className="size-[24px]" />
          </Button>
        </div>
      )}

      {/* Settings Drawer */}
      <SettingsDrawer isOpen={isSettingsOpen} onClose={closeSettingsDrawer} />
    </div>
  );
};

export default DocentContent;

'use client';

import Link from 'next/link';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import LogoDark from '@/components/ui/icons/LogoDark';
import LogoLight from '@/components/ui/icons/LogoLight';
import type { ReactNode } from 'react';

export interface HeaderProps {
  readonly leftButton?: {
    readonly href: '/docent' | `/docent/tour/${string}`;
    readonly icon?: ReactNode;
    readonly text: string;
  };
  readonly useDarkLogo?: boolean;
}

const Header = ({ leftButton, useDarkLogo }: HeaderProps) => {
  return (
    <div className="absolute top-0 left-0 flex h-30 w-full items-center px-5">
      {/* Left Button */}
      <div className="flex flex-1">
        {leftButton && (
          <Link href={leftButton.href}>
            <Button className="flex h-13 items-center gap-3.5 px-6" size="sm" variant="outline-light-grey">
              {leftButton.icon}
              <span className="h-6.25 text-[20px]">{leftButton.text}</span>
            </Button>
          </Link>
        )}

        {!leftButton && <div />}
      </div>

      {/* Logo. Use colored one on home page, white one on other pages */}
      <div className="flex flex-1 justify-center">
        {useDarkLogo ? <LogoDark className="h-10 w-60" /> : <LogoLight className="h-10 w-60" />}
      </div>

      {/* Right language buttons */}
      <div className="flex flex-1 justify-end gap-2">
        <Button className="h-8 w-16" size="sm" variant={useDarkLogo ? 'outline-mid-blue' : 'outline-light-grey'}>
          <span className="text-[18px]">EN</span>
        </Button>
        <Button className="h-8 w-16" size="sm" variant={useDarkLogo ? 'outline-mid-blue' : 'outline-light-grey'}>
          <span className="text-[18px]">BR</span>
        </Button>
      </div>
    </div>
  );
};

export default Header;

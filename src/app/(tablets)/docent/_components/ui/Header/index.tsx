'use client';

import Link from 'next/link';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import LogoDark from '@/components/ui/icons/LogoDark';
import LogoLight from '@/components/ui/icons/LogoLight';
import { cn } from '@/lib/tailwind/utils/cn';
import type { Locale } from '@/lib/internal/types';
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
  const { locale, setLocale } = useDocent();

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  const handleEnglishClick = () => {
    handleLocaleChange('en');
  };

  const handlePortugueseClick = () => {
    handleLocaleChange('pt');
  };

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

      <div className="flex flex-1 justify-center">
        {useDarkLogo ? <LogoDark className="h-10 w-60" /> : <LogoLight className="h-10 w-60" />}
      </div>

      {/* Logo. Use dark one on home page, light one on other pages */}
      <div className="flex flex-1 justify-end gap-2">
        <Button
          className={cn('h-8 w-16', locale === 'pt' ? 'opacity-40' : 'opacity-100')}
          onClick={handleEnglishClick}
          size="sm"
          variant={useDarkLogo ? 'outline-mid-blue' : 'outline-light-grey'}
        >
          <span className="text-[18px] leading-normal">EN</span>
        </Button>
        <Button
          className={cn('h-8 w-16', locale === 'en' ? 'opacity-40' : 'opacity-100')}
          onClick={handlePortugueseClick}
          size="sm"
          variant={useDarkLogo ? 'outline-mid-blue' : 'outline-light-grey'}
        >
          <span className="text-[18px] leading-normal">BR</span>
        </Button>
      </div>
    </div>
  );
};

export default Header;

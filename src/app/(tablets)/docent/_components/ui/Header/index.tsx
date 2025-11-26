'use client';

import Link from 'next/link';
import { useDocent } from '@/app/(tablets)/docent/_components/providers/docent';
import { Button } from '@/app/(tablets)/docent/_components/ui/Button';
import LogoDark from '@/components/ui/icons/LogoDark';
import LogoLight from '@/components/ui/icons/LogoLight';
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

  return (
    <div className="absolute top-0 left-0 flex h-30 w-full items-center justify-between px-5">
      {/* Left Button */}
      {leftButton && (
        <Link href={leftButton.href}>
          <Button className="flex h-13 items-center gap-3.5 px-6" size="sm" variant="outline-light-grey">
            {leftButton.icon}
            <span className="h-6.25 text-[20px]">{leftButton.text}</span>
          </Button>
        </Link>
      )}

      {!leftButton && <div />}

      {/* Logo and Locale Toggle */}
      <div className="flex items-center gap-4">
        {/* Logo. Use colored one on home page, white one on other pages */}
        {useDarkLogo ? <LogoDark className="h-[39px] w-[150px]" /> : <LogoLight className="h-[39px] w-[150px]" />}

        {/* Locale Toggle */}
        <div className="flex gap-2">
          <button
            className={locale === 'en' ? 'text-primary-im-mid-blue underline' : 'text-primary-bg-grey'}
            onClick={() => handleLocaleChange('en')}
            type="button"
          >
            EN
          </button>
          <span className="text-primary-bg-grey">|</span>
          <button
            className={locale === 'pt' ? 'text-primary-im-mid-blue underline' : 'text-primary-bg-grey'}
            onClick={() => handleLocaleChange('pt')}
            type="button"
          >
            PT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;

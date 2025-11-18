'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/shadcn/button';

interface HeaderProps {
  leftButton?: {
    href: string;
    icon?: React.ReactNode;
    text: string;
  };
}

const Header = ({ leftButton }: HeaderProps) => {
  return (
    <div className="absolute top-0 left-0 flex h-30 w-full items-center justify-between px-5">
      {/* Left Button */}
      {leftButton && (
        <Link href={{ pathname: leftButton.href }}>
          <Button className="flex h-13 items-center gap-3.5 px-6" size="sm" variant="outline">
            {leftButton.icon}
            <span className="h-6.25 text-[20px]">{leftButton.text}</span>
          </Button>
        </Link>
      )}
      {!leftButton && <div />}

      {/* Logo. Use colored one on home page, white one on other pages */}
      {usePathname() === '/docent' ? (
        <Image
          alt="Iron Mountain Logo"
          className="object-contain"
          height={39}
          src="/images/iron-mountain-logo-colored.svg"
          width={150}
        />
      ) : (
        <Image
          alt="Iron Mountain Logo"
          className="object-contain"
          height={39}
          src="/images/iron-mountain-logo-white.svg"
          width={150}
        />
      )}
    </div>
  );
};

export default Header;

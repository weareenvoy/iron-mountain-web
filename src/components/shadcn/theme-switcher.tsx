/* eslint-disable react/function-component-definition */

'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/shadcn/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu';

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  const setTheTheme = (theme: 'dark' | 'light' | 'system') => () => {
    setTheme(theme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem active={theme === 'light'} onClick={setTheTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem active={theme === 'dark'} onClick={setTheTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem active={theme === 'system'} onClick={setTheTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export interface Theme {
  name: string;
  value: string;
}

export const themes: Readonly<Theme[]> = [
  { name: 'Dark', value: 'dark' },
  { name: 'Light', value: 'light' },
  { name: 'System', value: 'system' },
] as const;

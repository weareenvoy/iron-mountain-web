import type { PropsWithChildren } from 'react';
import './_styles/globals.css';

const KiosksRootLayout = ({ children }: PropsWithChildren) => {
  return <div data-app="displays-kiosks">{children}</div>;
};

export default KiosksRootLayout;

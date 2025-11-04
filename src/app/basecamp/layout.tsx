"use client";

import { BasecampProvider } from "./_contexts/BasecampProvider";

export default function BasecampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BasecampProvider>{children}</BasecampProvider>;
}

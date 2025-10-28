"use client";

import { BasecampProvider } from "./_components/BasecampProvider";

export default function BasecampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BasecampProvider>{children}</BasecampProvider>;
}

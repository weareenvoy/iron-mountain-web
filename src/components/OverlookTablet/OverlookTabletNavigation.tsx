"use client";

import { createContext, useContext, ReactNode } from "react";

type OverlookTabletView =
  | "tabletHome"
  | "mainMenu"
  | "protectConnectActivate"
  | "insightDXP"
  | "customerSuccess";

interface OverlookTabletNavigationContextType {
  currentView: OverlookTabletView;
  navigateTo: (view: OverlookTabletView) => void;
}

const OverlookTabletNavigationContext =
  createContext<OverlookTabletNavigationContextType | null>(null);

interface OverlookTabletNavigationProviderProps {
  children: ReactNode;
  currentView: OverlookTabletView;
  onNavigate: (view: OverlookTabletView) => void;
}

export function OverlookTabletNavigationProvider({
  children,
  currentView,
  onNavigate,
}: OverlookTabletNavigationProviderProps) {
  return (
    <OverlookTabletNavigationContext.Provider
      value={{ currentView, navigateTo: onNavigate }}
    >
      {children}
    </OverlookTabletNavigationContext.Provider>
  );
}

export function useOverlookTabletNavigation() {
  const context = useContext(OverlookTabletNavigationContext);
  if (!context) {
    throw new Error(
      "useOverlookTabletNavigation must be used within OverlookTabletNavigationProvider",
    );
  }
  return context;
}

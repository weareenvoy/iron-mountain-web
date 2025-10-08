"use client";

import { useState } from "react";
import { OverlookTabletNavigationProvider } from "@/components/OverlookTablet/OverlookTabletNavigation";
import TabletHome from "@/components/OverlookTablet/TabletHome";
import MainMenu from "@/components/OverlookTablet/MainMenu";
import ProtectConnectActivate from "@/components/OverlookTablet/ProtectConnectActivate";
import InsightDXP from "@/components/OverlookTablet/InsightDXP";
import CustomerSuccessStory from "@/components/OverlookTablet/CustomerSuccessStory";
import { OverlookTabletHeader } from "@/components/OverlookTablet/OverlookTabletHeader";

type OverlookTabletView =
  | "tabletHome"
  | "mainMenu"
  | "protectConnectActivate"
  | "insightDXP"
  | "customerSuccess";

export default function OverlookTablet() {
  const [currentView, setCurrentView] = useState<OverlookTabletView>("tabletHome");

  const renderCurrentView = () => {
    switch (currentView) {
      case "tabletHome":
        return <TabletHome />;
      case "mainMenu":
        return <MainMenu />;
      case "protectConnectActivate":
        return <ProtectConnectActivate />;
      case "insightDXP":
        return <InsightDXP />;
      case "customerSuccess":
        return <CustomerSuccessStory />;
      default:
        return <TabletHome />;
    }
  };

  // Determine header props based on currentView
  const getHeaderProps = () => {
    switch (currentView) {
      case "tabletHome":
        return {
          showBackButton: false,
          logoVariant: "colored" as const,
        };
      case "mainMenu":
        return {
          showBackButton: true,
          backButtonText: "Back to Home",
          logoVariant: "white" as const,
        };
      default:
        return {
          showBackButton: true,
          backButtonText: "Back to Menu",
          logoVariant: "white" as const,
          onBackClick: () => setCurrentView("mainMenu"), // override default navigation
        };
    }
  };

  return (
    <OverlookTabletNavigationProvider
      currentView={currentView}
      onNavigate={setCurrentView}
    >
      <div className="h-[1366px] w-[1024px] overflow-hidden">
        <OverlookTabletHeader {...getHeaderProps()} />
        {renderCurrentView()}
      </div>
    </OverlookTabletNavigationProvider>
  );
}

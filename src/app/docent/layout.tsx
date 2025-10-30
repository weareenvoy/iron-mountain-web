"use client";

import { DocentProvider } from "./_components/DocentProvider";
import { SettingsDrawer } from "./_components/SettingsDrawer";
import { useDocent } from "./_components/DocentProvider";
import { usePathname } from "next/navigation";
import { FiSettings } from "react-icons/fi";
import { Button } from "@/components/Button";

function DocentLayoutContent({ children }: { children: React.ReactNode }) {
  const { isSettingsOpen, setIsSettingsOpen, isLoading, isConnected } =
    useDocent();
  const pathname = usePathname();
  const isHomePage = pathname === "/docent";

  // Just a tiny UI improvement. Only show settings button when app is ready.
  const isReady = !isLoading && isConnected;

  return (
    <div className="relative flex h-[1133px] w-[744px] items-center justify-center overflow-hidden bg-linear-[348deg,#00A88E_0%,#1B75BC_100%]">
      {children}

      {/* Global Settings Button - Show on all pages except home */}
      {isReady && !isHomePage && (
        <div className="absolute top-34 right-5 z-50">
          <Button
            onClick={() => setIsSettingsOpen(true)}
            variant="outline-light-grey"
            size="sm"
            className="h-13 w-40 gap-3.5"
          >
            <FiSettings size={24} />
            {/* When someone clicks it, asks for data (each exhibit's status) */}
            <span className="h-6.25 text-xl">Settings</span>
          </Button>
        </div>
      )}

      {/* Settings Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default function DocentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocentProvider>
      <DocentLayoutContent>{children}</DocentLayoutContent>
    </DocentProvider>
  );
}

"use client";

import { DocentProvider } from "./_components/DocentProvider";
import { SettingsDrawer } from "./_components/SettingsDrawer";
import { useDocent } from "./_components/DocentProvider";
import { usePathname } from "next/navigation";
import { FiCast, FiSettings } from "react-icons/fi";
import { Button } from "@/components/Button";

function DocentLayoutContent({ children }: { children: React.ReactNode }) {
  const { isSettingsOpen, setIsSettingsOpen } = useDocent();
  const pathname = usePathname();
  const isHomePage = pathname === "/docent";
  const showCastButton =
    pathname.includes("/overlook") || pathname.includes("/summit-room");

  return (
    <div className="relative flex h-[1133px] w-[744px] items-center justify-center bg-linear-[348deg,#00A88E_0%,#1B75BC_100%]">
      {children}

      {/* Global cast button, only show when it's overlook or summit room */}
      {showCastButton && (
        <div className="absolute top-[188px] left-10 z-50">
          <Button variant="outline-white" className="h-18 w-18 rounded-full">
            <FiCast />
          </Button>
        </div>
      )}

      {/* Global Settings Button - Show on all pages except home */}
      {!isHomePage && (
        <div className="absolute top-[188px] right-10 z-50">
          <Button
            onClick={() => setIsSettingsOpen(true)}
            variant="outline-white"
            className="h-18 w-37"
          >
            <FiSettings size={24} />
            {/* When someone clicks it, asks for data (each exhibit's status) */}
            <span className="text-[20px]">Settings</span>
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

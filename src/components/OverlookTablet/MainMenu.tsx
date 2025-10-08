"use client";

import { useOverlookTabletNavigation } from "../OverlookTablet/OverlookTabletNavigation";

export default function MainMenu() {
  const { navigateTo } = useOverlookTabletNavigation();

  return (
    <div className="flex h-full w-full flex-col items-center gap-50 bg-gradient-to-b from-[#1b75bc] to-[#00a88e] py-40">
      {/* Titles */}
      <div className="text-center">
        <h1 className="mb-4 text-4xl tracking-tight text-[#ededed]">
          Main Menu
        </h1>
        <p className="text-2xl text-[#ededed]">
          Select a section from the menu
          <br />
          to begin exploring.
        </p>
      </div>

      {/* Grid as a whole rotate 45 deg, item text rotate -45 deg */}
      <div className="grid rotate-45 grid-cols-2 gap-4">
        {/* Item 1 */}
        <button
          onClick={() => navigateTo("protectConnectActivate")}
          className="relative flex h-65 w-65 items-center justify-center rounded-lg bg-[#ededed]"
        >
          <p className="-rotate-45 text-[20px] font-semibold whitespace-pre text-[#14477d]">
            Protect, Connect,
            <br />
            Activate
          </p>
        </button>

        {/* Item 2 */}
        <button
          onClick={() => navigateTo("insightDXP")}
          className="relative flex h-65 w-65 items-center justify-center rounded-lg bg-[#ededed]"
        >
          <p className="-rotate-45 text-[20px] font-semibold whitespace-pre text-[#14477d]">
            Iron Mountain
            <br />
            InSight® DXP
          </p>
        </button>

        {/* Item 3 (manually placed in column 2, row 2) */}
        <button
          onClick={() => navigateTo("customerSuccess")}
          className="relative col-start-2 row-start-2 flex h-65 w-65 items-center justify-center rounded-lg bg-[#ededed]"
        >
          <p className="-rotate-45 text-[20px] font-semibold whitespace-pre text-[#14477d]">
            Customer
            <br />
            Success Story
          </p>
        </button>
      </div>
    </div>
  );
}

"use client";

import { useOverlookTabletNavigation } from "../OverlookTablet/OverlookTabletNavigation";

export default function MainMenu() {
  const { navigateTo } = useOverlookTabletNavigation();

  return (
    <div className="flex h-full w-full flex-col items-center bg-linear-[0deg,#00A88E_0%,#1B75BC_100%] py-40">
      {/* Titles */}
      <div className="flex flex-col gap-13.5 text-center">
        <h1 className="text-primary-bg-grey text-[40px] tracking-tight">
          Main Menu
        </h1>
        <p className="text-primary-bg-grey text-2xl">
          Select a section from the menu
          <br />
          to begin exploring.
        </p>
      </div>

      {/* Grid as a whole rotate 45 deg, item text rotate -45 deg */}
      <div className="absolute top-130 left-40 grid rotate-45 grid-cols-2 gap-4">
        {/* Item 1 */}
        <button
          onClick={() => navigateTo("protectConnectActivate")}
          className="bg-primary-bg-grey relative flex h-65 w-65 items-center justify-center rounded-lg"
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-[27px]">
            Protect, Connect,
            <br />
            Activate
          </p>
        </button>

        {/* Item 2 */}
        <button
          onClick={() => navigateTo("insightDXP")}
          className="bg-primary-bg-grey relative flex h-65 w-65 items-center justify-center rounded-lg"
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-[27px]">
            Iron Mountain
            <br />
            InSight® DXP
          </p>
        </button>

        {/* Item 3 (manually placed in column 2, row 2) */}
        <button
          onClick={() => navigateTo("customerSuccess")}
          className="bg-primary-bg-grey relative col-start-2 row-start-2 flex h-65 w-65 items-center justify-center rounded-lg"
        >
          <p className="text-primary-im-dark-blue -rotate-45 text-[27px]">
            Customer
            <br />
            Success Story
          </p>
        </button>
      </div>
    </div>
  );
}

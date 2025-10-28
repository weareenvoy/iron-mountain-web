"use client";

import { use } from "react";
import { MomentsAndBeats } from "../../../_components/MomentsAndBeats";
import { Moment } from "@/types";

const OVERLOOK_CONTENT: Moment[] = [
  {
    id: "ambient",
    title: "Ambient state",
    beatCount: 1,
  },
  {
    id: "unlock",
    title: "Unlock",
    beatCount: 2,
  },

  {
    id: "protect",
    title: "Protect",
    beatCount: 2,
  },
  {
    id: "connect",
    title: "Connect",
    beatCount: 2,
  },
  {
    id: "activate",
    title: "Activate",
    beatCount: 2,
  },
  {
    id: "insight-dxp",
    title: "InSight DXP",
    beatCount: 5,
  },
  {
    id: "case-study",
    title: "Impact (case study)",
    beatCount: 2, // 1 normal beat, and 1 video. Video is just like a normal beat, but with a play/pause button.
  },
  {
    id: "futurescape",
    title: "Futurescape",
    beatCount: 4,
  },
];

interface OverlookPageProps {
  params: Promise<{ tourId: string }>;
}

export default function OverlookPage({ params }: OverlookPageProps) {
  const { tourId } = use(params);

  return (
    <MomentsAndBeats
      tourId={tourId}
      exhibitType="overlook"
      content={OVERLOOK_CONTENT}
    />
  );
}

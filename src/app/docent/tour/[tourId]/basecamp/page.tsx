"use client";

import { use } from "react";
import { MomentsAndBeats } from "../../../_components/MomentsAndBeats";
import { Moment } from "@/types";

const BASECAMP_CONTENT: Moment[] = [
  {
    id: "ambient",
    title: "Ambient state",
    beatCount: 1,
  },
  {
    id: "welcome",
    title: "Welcome",
    beatCount: 4,
  },
  {
    id: "problem",
    title: "Problem",
    beatCount: 4,
  },
  {
    id: "possibilities",
    title: "Possibilities",
    beatCount: 5,
  },
  {
    id: "ascend",
    title: "Ascend",
    beatCount: 3,
  },
];
interface BasecampPageProps {
  params: Promise<{ tourId: string }>;
}

export default function BasecampPage({ params }: BasecampPageProps) {
  const { tourId } = use(params);

  return (
    <MomentsAndBeats
      tourId={tourId}
      title="Basecamp"
      content={BASECAMP_CONTENT}
    />
  );
}
